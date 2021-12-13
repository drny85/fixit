import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

import Stripe from 'stripe';
import { UserRecord } from 'firebase-functions/v1/auth';
const stripe = new Stripe(process.env.STRIPE_TEST_KEY!, {
	apiVersion: '2020-08-27',
});

admin.initializeApp();

interface response {
	success: boolean;
	result: any;
}
interface Log {
	id?: string;
	requestId: string;
	body: string;
	cost: number | null;
	loggedOn: string;
	price_id?: string;
	customer_id?: string;
}

exports.createPaymentIntent = functions.https.onCall(
	async (
		data: { requestId: string; contractorId: string },
		context: functions.https.CallableContext
	): Promise<response> => {
		try {
			if (!context.auth) return { success: false, result: 'Not authotized' };
			const email = context.auth?.token.email;
			const uid = context.auth?.uid;

			const requestId = data.requestId;
			const logs = await getLogs(requestId);
			if (logs.length === 0) return { success: false, result: 'not data' };
			const customer_id = logs[0].customer_id;
			const { result, success } = await getContractorConnectedId(requestId);
			if (!success)
				return {
					success: false,
					result: `no connected account id found for ${context?.auth?.token.email}`,
				};
			const totalPrice = () =>
				+logs.reduce((acc, curr) => acc + curr?.cost!, 0).toFixed(2);
			const ephemeralKey = await stripe.ephemeralKeys.create(
				{ customer: customer_id },
				{ apiVersion: '2020-08-27' }
			);
			const paymentIntent = await stripe.paymentIntents.create({
				customer: customer_id,
				payment_method_types: ['card'],
				amount: Math.round(totalPrice() * 100),
				currency: 'usd',
				receipt_email: email,
				application_fee_amount: Math.round(totalPrice()) * 0.08 * 100,
				transfer_data: {
					destination: result,
				},

				metadata: {
					requestId,
					customerId: uid,
					contractorId: data.contractorId,
				},
			});

			return {
				success: true,
				result: {
					paymentIntent: paymentIntent.client_secret,
					ephemeralKey: ephemeralKey.secret,
					customer: customer_id,
					paymentId: paymentIntent.id,
				},
			};
		} catch (error) {
			console.log('ERROR', error);
			throw new functions.https.HttpsError(
				'aborted',
				'error ocuured in payment intent',
				error
			);
		}
	}
);

exports.createStripeCustomer = functions.firestore
	.document('/users/{userId}')
	.onWrite(async (change, context) => {
		try {
			const data = change.after.data();
			if (data === null) {
				return null;
			}
			const email = data?.email;
			const name = data?.firstName + ' ' + data?.lastName;
			const customer = await stripe.customers.create({
				email: email,
				name: name,
				phone: data?.phone,
			});
			return await admin
				.firestore()
				.collection('stripe_customers')
				.doc(context.params.userId)
				.set({ customer_id: customer.id });
		} catch (error) {
			throw new functions.https.HttpsError(
				'aborted',
				'error while creating stripe customer'
			);
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
		throw new functions.https.HttpsError(
			'aborted',
			'error while making admin',
			error
		);
	}
});

exports.makeUserAContractor = functions.https.onCall(async (data, context) => {
	try {
		if (context.auth?.token.role !== 'admin') {
			throw new functions.https.HttpsError(
				'permission-denied',
				'user not authorized'
			);
		}
		if (!data.email)
			throw new functions.https.HttpsError(
				'failed-precondition',
				'not email provided'
			);
		const user = await admin.auth().getUserByEmail(data.email);

		return activateContractor(data.email, user).then(() => {
			return admin
				.firestore()
				.collection('users')
				.doc(user.uid)
				.set({ isActive: true, activatedOn: Date.now() }, { merge: true });
		});
	} catch (error) {
		console.log(error);
		throw new functions.https.HttpsError(
			'aborted',
			'error while making an user a contractor',
			error
		);
	}
});

exports.createConnectedAccountForUser = functions.https.onCall(
	async (
		data: {
			businessName: string;
			phone: string;
			address: any;
			firstName: string;
			lastName: string;
		},
		context
	): Promise<response> => {
		try {
			const email = context.auth?.token.email;
			const isAuth = await isAuthorizedContractor(email!);
			if (!context.auth || !isAuth)
				throw new functions.https.HttpsError(
					'permission-denied',
					'you are not authorized'
				);

			const address = data.address.split(', ');

			const account = await stripe.accounts.create({
				type: 'express',
				email: email,
				business_type: 'individual',
				business_profile: {
					name: data.businessName,
					url: 'https://robertdev.net',
				},
				individual: {
					last_name: data.lastName,
					first_name: data.firstName,
					address: {
						line1: address[0],
						city: address[1],
						state: address[2].split(' ')[0],
						postal_code: address[2].split(' ')[1],
						country: 'US',
					},
					phone: data.phone,
				},
			});

			const accountLink = await stripe.accountLinks.create({
				account: account.id,
				refresh_url: `https://robertdev.net/reauth?accountId=${account.id}`,
				return_url: `https://robertdev.net/return_url?accountId=${account.id}`,
				type: 'account_onboarding',
			});

			return { success: true, result: accountLink.url };
		} catch (error) {
			console.log(error);
			throw new functions.https.HttpsError(
				'aborted',
				'error creating connected account',
				error
			);
		}
	}
);

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
			const token = await me.data()?.pushToken;
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
					body: `${data.firstName} ${data.lastName} just signup, \n Email: ${data.email}`,
					data: { notificationType: 'new_signup', userId },
				}),
			});
		} catch (error) {
			console.log(error);
			throw new functions.https.HttpsError(
				'aborted',
				'error sending notification'
			);
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
			console.log(error);
			throw new functions.https.HttpsError(
				'aborted',
				'error sending notification'
			);
		}
	});

exports.createStripeProduct = functions.firestore
	.document('/logs/{requestId}/logs/{autoId}')
	.onCreate(async (snap, context): Promise<response> => {
		try {
			const data = snap.data();
			const cost = Math.round(data.cost * 100);
			if (data.cost === 0)
				return { success: false, result: 'no proce provided' };

			const productName = data.body;
			const requestId = context.params.requestId;
			const requestData = await admin
				.firestore()
				.collection('requests')
				.doc(requestId)
				.get();
			const userId = await requestData.data()?.customer.id;
			if (!userId) return { success: false, result: 'no user id found' };
			const stripeCustomerObject = await admin
				.firestore()
				.collection('stripe_customers')
				.doc(userId)
				.get();
			const customer_id = await stripeCustomerObject.data()?.customer_id;
			if (!customer_id)
				return { success: false, result: 'no customer id found' };
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
			throw new functions.https.HttpsError(
				'not-found',
				'error while creating price'
			);
		}
	});

exports.addConnectedAccountToUser = functions.https.onCall(
	async (data: { accountId: string }, context): Promise<response> => {
		try {
			const isAuth = await isAuthorizedContractor(context.auth?.token.email!);

			if (!context.auth || !isAuth)
				return { success: false, result: 'Not authorized' };

			const { accountId } = data;
			if (!accountId)
				return { success: false, result: 'no account Id provided' };

			const account = await stripe.accounts.retrieve({
				stripeAccount: accountId,
			});
			const { charges_enabled } = account;
			if (charges_enabled) {
				await admin.firestore().collection('users').doc(context.auth.uid).set(
					{
						connectedAccountId: account.id,
						activatedOn: new Date().toISOString(),
					},
					{ merge: true }
				);
			}
			return { success: true, result: charges_enabled };
		} catch (error) {
			console.log(error);
			throw new functions.https.HttpsError(
				'aborted',
				'error while adding connected account'
			);
		}
	}
);

exports.webhook = functions.https.onRequest(
	async (
		req: functions.https.Request,
		res: functions.Response<any>
	): Promise<any> => {
		const webhookSecret = process.env.WEBHOOK_KEY_CONNECTED;
		const signature = req.headers['stripe-signature'];
		const payloadData = req.rawBody;
		const payloadString = payloadData.toString();
		let event;

		try {
			if (!webhookSecret || !signature) return;
			event = stripe.webhooks.constructEvent(
				payloadString,
				signature,
				webhookSecret
			);
			const webhookRef = admin.firestore().collection('webhooks').doc(event.id);

			const exists = (await webhookRef.get()).exists;
			if (exists) return res.status(400).send('Already exists');
			const wkType = { type: event.type };
			const wkStatus = { status: 'new' };
			const eventType = { event_type: 'connectedAccount' };
			const data = {
				...wkStatus,
				...wkType,
				...eventType,
				...event.data.object,
			};

			await webhookRef.set(data);

			switch (event.type) {
				case 'account.updated':
					const accountUpdated = event.data.object as Stripe.Account;
					const { details_submitted, charges_enabled, id } = accountUpdated;
					functions.logger.log(
						`Details Submitted for acc ${accountUpdated.id} ${JSON.stringify(
							details_submitted,
							null,
							2
						)}`
					);
					if (charges_enabled) {
						functions.logger.log('Account successfuly active - ' + id);
					}
					break;

				default:
					console.log(`Unhandled event type ${event.type}`);
					functions.logger.error('Error', event.type);
					break;
			}

			return res.status(200).send('Success');
		} catch (error) {
			console.log(error);
			functions.logger.error('Error message', error);
			return res.status(400).send(`Webhook Connected Error:' ${error}`);
		}
	}
);

exports.webhookAccount = functions.https.onRequest(
	async (
		req: functions.https.Request,
		res: functions.Response<any>
	): Promise<any> => {
		const webhookSecret = process.env.WEBHOOK_KEY_MAIN;
		const signature = req.headers['stripe-signature'];
		const payloadData = req.rawBody;
		const payloadString = payloadData.toString();
		let event;

		try {
			if (!webhookSecret || !signature) return;
			event = stripe.webhooks.constructEvent(
				payloadString,
				signature,
				webhookSecret
			);
			const webhookRef = admin.firestore().collection('webhooks').doc(event.id);

			const exists = (await webhookRef.get()).exists;
			if (exists) return res.status(400).send('Already exists');
			const wkType = { type: event.type };
			const wkStatus = { status: 'new' };
			const eventType = { event_type: 'mainAccount' };
			const data = {
				...wkStatus,
				...wkType,
				...eventType,
				...event.data.object,
			};

			await webhookRef.set(data);
			switch (event.type) {
				case 'payment_intent.payment_failed':
					const paymentIntentFailed = event.data.object as Stripe.PaymentIntent;
					// Then define and call a function to handle the event payment_intent.payment_failed
					console.log(paymentIntentFailed);
					break;
				case 'payment_intent.succeeded':
					const paymentIntentSucceeded = event.data
						.object as Stripe.PaymentIntent;

					const { metadata, amount, id } = paymentIntentSucceeded;
					const { requestId, contractorId } = metadata;

					const requestRef = await admin
						.firestore()
						.collection('requests')
						.doc(requestId);
					const exits = (await requestRef.get()).exists;
					if (!exits)
						throw new functions.https.HttpsError(
							'unavailable',
							'no request found with id: ' + requestId
						);

					await requestRef.set(
						{
							paid: true,
							payment_intent_id: id,
							amountPaid: amount / 100,
							status: 'completed',
							amount: amount,
							paidOn: new Date().toISOString(),
						},
						{ merge: true }
					);

					if (contractorId) {
						const contractor = await admin
							.firestore()
							.collection('users')
							.doc(contractorId)
							.get();
						const pushToken = await contractor.data()?.pushToken;
						if (pushToken) {
							const requestObject = (await requestRef.get()).data();
							await sendPaymentNotification(
								pushToken,
								requestId,
								requestObject?.service.name
							);
						}
					}

					// Then define and call a function to handle the event payment_intent.succeeded
					break;
				// ... handle other event types
				case 'account.updated':
					const accountUpdated = event.data.object as Stripe.Account;
					const { details_submitted } = accountUpdated;
					functions.logger.log(
						`Details Submitted for acc ${accountUpdated.id} ${JSON.stringify(
							details_submitted,
							null,
							2
						)}`
					);
					break;

				default:
					console.log(`Unhandled event type ${event.type}`);
					functions.logger.error('Error', event.type);
					break;
			}

			return res.status(200).send('Success');
		} catch (error) {
			console.log(error);
			functions.logger.error('Error message', error);
			return res.status(400).send(`Webhook Main Error:' ${error}`);
		}
	}
);

const getLogs = async (requestId: string) => {
	try {
		const logsData = await admin
			.firestore()
			.collection('logs')
			.doc(requestId)
			.collection('logs')
			.get();

		const results = logsData.docs
			.map((doc) => ({ id: doc.id, ...doc.data() } as Log))
			.filter((log) => log.price_id !== undefined || log.price_id !== null);

		if (results.length === 0)
			throw new functions.https.HttpsError('not-found', 'there are not data');

		console.log('Logs Total => ', results.length);
		return results;
	} catch (error) {
		return [];
	}
};

const getContractorConnectedId = async (requestId: string) => {
	try {
		const requestObject = await admin
			.firestore()
			.collection('requests')
			.doc(requestId)
			.get();

		const contratorObject = await requestObject.data()?.contractor;

		if (!contratorObject) return { success: false, result: null };
		const connnectId = contratorObject.connectedAccountId;
		if (!connnectId) return { success: false, result: null };

		return { success: true, result: connnectId };
	} catch (error) {
		return { success: false, result: null };
	}
};

async function grantAdminAccess(email: string) {
	const user = await admin.auth().getUserByEmail(email);
	if (user.customClaims && user.customClaims.role === 'admin') return;

	return admin.auth().setCustomUserClaims(user.uid, {
		role: 'admin',
		accessLevel: 10,
	});
}

async function activateContractor(email: string, user: UserRecord) {
	return admin.auth().setCustomUserClaims(user.uid, {
		role: 'contractor',
	});
}

async function isAuthorizedContractor(email: string): Promise<boolean> {
	const user = await admin.auth().getUserByEmail(email);
	if (user.customClaims && user.customClaims.role === 'contractor') return true;
	return false;
}

async function sendPaymentNotification(
	token: string,
	requestId: string,
	requestName: string
) {
	try {
		const res = await fetch('https://exp.host/--/api/v2/push/send', {
			method: 'POST',
			headers: {
				host: 'exp.host',
				accept: 'application/json',
				'accept-encoding': 'gzip, deflate',
				'content-type': 'application/json',
			},
			body: JSON.stringify({
				to: token,
				title: `You Got Paid!`,
				body: `Money is on your way for ${requestName} job`,
				data: { notificationType: 'payment', result: requestId },
			}),
		});

		const data = await res.json();
		console.log(data);
	} catch (error) {
		console.log(error);
		throw functions.logger.error(error);
	}
}
