import { createAsyncThunk } from '@reduxjs/toolkit';
import { Contractor } from '../../constants/Contractors';
import { auth, db } from '../../firebase';

export const addContractor = async (
	contractor: Contractor
): Promise<boolean> => {
	try {
		if (contractor.services.length === 0) return false;

		if (!contractor.email || !contractor.password) return false;

		const { user } = await auth.createUserWithEmailAndPassword(
			contractor.email,
			contractor?.password!
		);

		await user?.sendEmailVerification();
		await user?.updateProfile({ displayName: contractor.name });

		delete contractor.password;

		await db.collection('users').doc(user?.uid).set(contractor);
		return true;
	} catch (error: any) {
		console.log(error);
		return false;
	}
};

export const isEmailAlreadyTaken = async (email: string): Promise<boolean> => {
	try {
		const results = await auth.fetchSignInMethodsForEmail(email);

		if (results.length > 0) {
			return true;
		}

		return false;
	} catch (error) {
		console.log(error);
		return false;
	}
};
