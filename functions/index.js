const functions = require('firebase-functions');
const admin = require('firebase-admin');
require('dotenv').config();
const { HttpsError } = require('firebase-functions/v1/https');
const fetch = require('node-fetch');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_PK, { apiVersion: '2020-08-27' });

admin.initializeApp();

exports.sendNotificationOnSignUp = functions.firestore
	.document('users/{userId}')
	.onCreate(async (snap, context) => {
		try {
			const data = snap.data();
			const userId = context.params.userId;
			const adminUser = await admin
				.auth()
				.getUserByEmail('melendez@robertdev.net');
			if (!adminUser) return;
			const me = await admin
				.firestore()
				.collection('users')
				.doc(adminUser.uid)
				.get();
			const token = await me.data().pushToken;
			if (!token) return;

			return fetch('https://exp.host/--/api/v2/push/send', {
				method: 'POST',
				headers: {
					host: 'exp.host',
					accept: 'application/json',
					'accept-encoding': 'gzip, deflate',
					'content-type': 'application/json',
				},
				body: JSON.stringify({
					to: token,
					title: `New Sign Up`,
					body: `${data.name} just signup, \n Email: ${data.email}`,
					data: { notificationType: 'new_signup', userId },
				}),
			});
		} catch (error) {
			throw new HttpsError(`Error ${error}`);
		}
	});

exports.sendNotificationOnNewRequest = functions.firestore
	.document('requests/{requestId}')
	.onCreate(async (snap, context) => {
		try {
			const data = snap.data();
			const token = data.contractor.pushToken;
			const requestId = context.params.requestId;
			if (!token) return;

			return fetch('https://exp.host/--/api/v2/push/send', {
				method: 'POST',
				headers: {
					host: 'exp.host',
					accept: 'application/json',
					'accept-encoding': 'gzip, deflate',
					'content-type': 'application/json',
				},
				body: JSON.stringify({
					to: token,
					title: `New Job Request`,
					body: `${data.customer.name} just submitted a request, \n Request For: ${data.service.name}`,
					data: { notificationType: 'new_request', requestId },
				}),
			});
		} catch (error) {
			throw new HttpsError(`Error ${error}`);
		}
	});

// // Create and Deploy Your First Cloud Functions
exports.makeUserAContractor = functions.https.onCall(async (data, context) => {
	try {
		if (context.auth?.token.role !== 'admin') {
			console.log('TOKEN', context.auth.token);
			return { result: 'Request not authorized' };
		}
		if (!data.email) return functions.https.HttpsError('not email provided');
		const user = await admin.auth().getUserByEmail(data.email);

		return activateContractor(data.email, user).then(() => {
			return admin
				.firestore()
				.collection('users')
				.doc(user.uid)
				.set({ isActive: true, activatedOn: Date.now() }, { merge: true });
		});
	} catch (error) {
		throw new HttpsError(error);
	}
});

exports.makeMeAdmin = functions.auth.user().onCreate(async (user) => {
	try {
		if (user.email && user.email === 'melendez@robertdev.net') {
			return grantAdminAccess(user.email).then(() => {
				return admin
					.firestore()
					.collection('users')
					.doc(user.uid)
					.update({ isActive: true, role: 'admin' });
			});
		} else {
			if (user.email) {
				return admin.auth().setCustomUserClaims(user.uid, {
					role: 'consumer',
				});
			}
		}
	} catch (error) {
		throw new HttpsError(error);
	}
});

async function grantAdminAccess(email) {
	const user = await admin.auth().getUserByEmail(email);
	if (user.customClaims && user.customClaims.role === 'admin') return;

	return admin.auth().setCustomUserClaims(user.uid, {
		role: 'admin',
		accessLevel: 10,
	});
}

async function activateContractor(email, user) {
	return admin.auth().setCustomUserClaims(user.uid, {
		role: 'contractor',
	});
}

exports.createStripeCustomer = functions.firestore
	.document('/users/{userId}')
	.onWrite(async (change, context) => {
		try {
			const data = change.after.data();
			if (data === null) {
				return null;
			}
			const email = data.email;
			const name = data.name;
			const customer = await stripe.customers.create({
				email: email,
				name: name,
			});
			await admin
				.firestore()
				.collection('stripe_customers')
				.doc(context.params.userId)
				.set({ customer_id: customer.id });
		} catch (error) {
			throw new HttpsError(error);
		}
	});

exports.createStripeInvoice = functions.firestore
	.document('/logs/{requestId}/logs/{autoId}')
	.onCreate(async (snap, context) => {
		try {
			const data = snap.data();
			const cost = Math.round(data.cost * 100);
			if (cost > 1) {
				const productName = data.body;
				const requestId = context.params.requestId;
				const requestData = await admin
					.firestore()
					.collection('requests')
					.doc(requestId)
					.get();
				const userId = await requestData.data().customer.id;
				if (!userId) return null;
				const stripeCustomerObject = await admin
					.firestore()
					.collection('stripe_customers')
					.doc(userId)
					.get();
				const customer_id = await stripeCustomerObject.data().customer_id;
				if (!customer_id) return new HttpsError('No customer_id found');
				const product = await stripe.products.create({
					name: productName.toUpperCase(),
				});

				const price = await stripe.prices.create({
					product: product.id,
					unit_amount: cost,
					currency: 'usd',
				});

				return await snap.ref.set(
					{
						price_id: price.id,
						customer_id: customer_id,
					},
					{ merge: true }
				);
			} else return null;
		} catch (error) {
			throw new HttpsError(error);
		}
	});

exports.collectPayment = functions.https.onCall(async (data, context) => {
	//data object expect a request object and requestUserId;
	try {
		const uid = context.auth.uid;
		const email = context.auth.token.email;
		const isVerified = context.auth.token.email_verified;
		const cust = await (
			await admin.firestore().collection('stripe_customers').doc(uid).get()
		).data();
		if (uid !== data.userId || !isVerified) {
			throw new HttpsError('User not authorized');
		}
		const response = await admin
			.firestore()
			.collection('logs')
			.doc(data.requestId)
			.collection('logs')
			.get();

		const logs = response.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

		if (logs.length === 0) return null;

		// const items = logs.map((i) => {
		// 	if (i.price_id) {
		// 		return { price: i.price_id, quantity: 1 };
		// 	}
		// });

		const totalPrice = () =>
			logs.reduce((acc, curr) => acc + curr.cost, 0).toFixed(2);

		const ephemeralKey = await stripe.ephemeralKeys.create(
			{ customer: cust.customer_id },
			{ apiVersion: '2020-08-27' }
		);

		const paymentIntent = await stripe.paymentIntents.create({
			payment_method_types: ['card'],
			currency: 'usd',
			amount: Math.round(totalPrice() * 100),
			receipt_email: email,
			customer: cust.customer_id,
			metadata: {
				requestId: data.requestId,
			},
		});

		return {
			paymentIntent: paymentIntent.client_secret,
			ephemeralKey: ephemeralKey.secret,
			customer: cust.customer_id,
		};
	} catch (error) {
		throw new HttpsError(error);
	}
});
