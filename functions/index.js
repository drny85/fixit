const functions = require('firebase-functions');
const admin = require('firebase-admin');
require('dotenv').config();

const fetch = require('node-fetch');
const Stripe = require('stripe');
const stripeKey =
	process.env.NODE_ENV === 'production'
		? process.env.STRIPE_LIVE_SK
		: process.env.STRIPE_PK;
const stripe = Stripe(stripeKey, { apiVersion: '2020-08-27' });

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
			throw new functions.https.HttpsError(`Error ${error}`);
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
			throw new functions.https.HttpsError(`Error ${error}`);
		}
	});

// // Create and Deploy Your First Cloud Functions
exports.makeUserAContractor = functions.https.onCall(async (data, context) => {
	try {
		if (context.auth?.token.role !== 'admin') {
			console.log('TOKEN', context.auth.token);
			return { result: 'Request not authorized' };
		}
		if (!data.email)
			return functions.https.functions.https.HttpsError('not email provided');
		const user = await admin.auth().getUserByEmail(data.email);

		return activateContractor(data.email, user).then(() => {
			return admin
				.firestore()
				.collection('users')
				.doc(user.uid)
				.set({ isActive: true, activatedOn: Date.now() }, { merge: true });
		});
	} catch (error) {
		throw new functions.https.HttpsError(error);
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
		throw new functions.https.HttpsError(error);
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
				phone: data.phone,
			});
			await admin
				.firestore()
				.collection('stripe_customers')
				.doc(context.params.userId)
				.set({ customer_id: customer.id });
		} catch (error) {
			throw new functions.https.HttpsError(error);
		}
	});

exports.createStripeInvoice = functions.firestore
	.document('/logs/{requestId}/logs/{autoId}')
	.onCreate(async (snap, context) => {
		try {
			const data = snap.data();
			const cost = Math.round(data.cost * 100);
			if (data.cost === 0) return null;

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
			if (!customer_id)
				return new functions.https.HttpsError('No customer_id found');
			const product = await stripe.products.create({
				name: productName.toUpperCase(),
			});

			const price = await stripe.prices.create({
				product: product.id,
				unit_amount: cost,
				tax_behavior: 'exclusive',
				currency: 'usd',
			});

			await snap.ref.set(
				{
					price_id: price.id,
					customer_id: customer_id,
				},
				{ merge: true }
			);

			return { success: true, result: 'successful' };
		} catch (error) {
			//throw new functions.https.HttpsError(error);
			return { success: false, result: error.message };
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
			throw new functions.https.HttpsError('User not authorized');
		}

		const logs = await getLogs(data.requestId);

		if (logs.length === 0) return null;

		// const items = logs.map((i) => {
		// 	if (i.price_id) {
		// 		return { price: i.price_id, quantity: 1 };
		// 	}
		// });

		logs.map(async (log) => {
			if (log.price_id) {
				try {
					await stripe.invoiceItems.create({
						customer: log.customer_id,
						price: log.price_id,
					});
				} catch (error) {
					throw new functions.https.HttpsError(error);
				}
			}
		});

		const invoice = await stripe.invoices.create({
			customer: cust.customer_id,
			auto_advance: true, // Auto-finalize this draft after ~1 hour
		});
		console.log('INV_ID', invoice.id);

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

		await stripe.invoices.sendInvoice(invoice.id);

		return {
			paymentIntent: paymentIntent.client_secret,
			ephemeralKey: ephemeralKey.secret,
			customer: cust.customer_id,
		};
	} catch (error) {
		throw new functions.https.HttpsError(error);
	}
});

exports.createQuote = functions.https.onCall(async (data, context) => {
	try {
		const admin = await isAuthorized(context.auth.token.email);
		if (!admin) throw new functions.https.HttpsError('Not authorized');
		const requestId = data.requestId;
		const logs = await getLogs(requestId);
		const address = await getRequestAddress(requestId);
		const customer = logs[0].customer_id;
		const formmatedAddress = address.split(', ');
		const updatedCustomer = await stripe.customers.update(customer, {
			address: {
				line1: formmatedAddress[0],
				city: formmatedAddress[1],
				state: formmatedAddress[2].split(' ')[0],
				postal_code: formmatedAddress[2].split(' ')[1],
				country: 'US',
			},
		});

		const line_items = logs.map((log) => ({ price: log.price_id }));
		const quote = await stripe.quotes.create({
			customer: updatedCustomer.id,
			line_items,
			metadata: {
				requestId,
				contractorId: context.auth.uid,
				contractorEmail: context.auth.token.email,
			},
		});
		const result = await stripe.quotes.finalizeQuote(quote.id);
		await stripe.quotes.pdf(result.id);
		const quoteInvoice = await stripe.quotes.accept(result.id);
		const invoiceUpdated = await stripe.invoices.update(quoteInvoice.invoice, {
			collection_method: 'send_invoice',
			auto_advance: false,
			days_until_due: 7,
			automatic_tax: {
				enabled: true,
			},
		});
		const invoice = await stripe.invoices.sendInvoice(invoiceUpdated.id);
		return { success: true, result: invoice, requestId };
	} catch (error) {
		//throw new functions.https.HttpsError('aborted', error.message);
		return { success: false, result: error.message };
	}
});

const getLogs = async (requestId) => {
	try {
		const logsData = await admin
			.firestore()
			.collection('logs')
			.doc(requestId)
			.collection('logs')
			.get();

		const results = logsData.docs
			.map((doc) => ({ id: doc.id, ...doc.data() }))
			.filter((log) => log.price_id !== undefined || log.price_id !== null);

		if (results.length === 0)
			throw new functions.https.HttpsError('not-found', 'there are not data');
		return results;
	} catch (error) {
		throw new functions.https.HttpsError(error);
	}
};

const isAuthorized = async (userEmail) => {
	try {
		const user = await admin.auth().getUserByEmail(userEmail);
		return (
			(user.customClaims && user.customClaims.role === 'contractor') ||
			(user.customClaims && user.customClaims.role === 'admin')
		);
	} catch (error) {
		throw new functions.https.HttpsError(error);
	}
};

exports.acceptQuote = functions.https.onCall(async (data, context) => {
	try {
		if (!context.auth)
			throw new functions.https.HttpsError(
				'permission-denied',
				'You are not authorized'
			);
		const quoteId = data.quoteId;
		const quote = await stripe.quotes.accept(quoteId);
		await stripe.invoices.update(quote.invoice, {
			collection_method: 'send_invoice',
			auto_advance: false,
			days_until_due: 7,
			automatic_tax: {
				enabled: true,
			},
		});
		return { success: true, result: quote };
	} catch (error) {
		//throw new functions.https.HttpsError(error);
		return { success: false, result: error.message };
	}
});

exports.sendInvoice = functions.https.onCall(async (data, context) => {
	try {
		const authorized = isAuthorized(context.auth.token.email);
		if (!authorized)
			throw new functions.https.HttpsError(
				'permission-denied',
				'not authorized'
			);
		if (!context.auth)
			throw new functions.https.HttpsError(
				'permission-denied',
				'not authorized'
			);

		const invoiceId = data.invoiceId;
		const invoice = await stripe.invoices.sendInvoice(invoiceId);
		return { invoiceId: invoice.id, customer: invoice.customer };
	} catch (error) {
		throw new functions.https.HttpsError(error);
	}
});

const getRequestAddress = async (requestId) => {
	try {
		const requestData = await admin
			.firestore()
			.collection('requests')
			.doc(requestId)
			.get();
		const address = await requestData.data().serviceAddress;
		return address;
	} catch (error) {
		throw new functions.https.HttpsError('not-found');
	}
};
