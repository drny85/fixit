const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

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
		return error;
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
				admin.auth().setCustomUserClaims(user.uid, {
					role: 'consumer',
				});
			}
		}
	} catch (error) {
		return error;
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
