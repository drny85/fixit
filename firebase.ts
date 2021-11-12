// Import the functions you need from the SDKs you need

import firebase from 'firebase/app';

import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/functions';

import Constants from 'expo-constants';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: process.env.apiKey,
	authDomain: process.env.authDomain,
	projectId: process.env.projectId,
	storageBucket: process.env.storageBucket,
	messagingSenderId: process.env.messagingSenderId,
	appId: process.env.appId,
	measurementId: process.env.measurementId,
};

let app;
if (firebase.apps.length === 0) {
	app = firebase.initializeApp(firebaseConfig);
} else {
	app = firebase.app();
}

const db = app.firestore();
const storage = app.storage();
const auth = app.auth();
const functions = app.functions();

export { db, storage, auth, functions };
