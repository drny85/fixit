import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Contractor } from '../../constants/Contractors';
import { auth, db } from '../../firebase';
import { User } from '../../types';
import { resetRequests } from '../requestReducer/requestSlide';

export interface UserData extends Contractor {
	role: 'contractor' | 'consumer' | 'admin';
	password?: string;
}

export const signup = createAsyncThunk(
	'auth/signup',
	async (userData: UserData, thunkApi) => {
		try {
			const { user } = await auth.createUserWithEmailAndPassword(
				userData.email.toLowerCase().trim(),
				userData.password ? userData.password : ''
			);

			console.log('USER', user?.email);

			if (userData.password) {
				delete userData['password'];
			}
			if (user?.uid) {
				await db
					.collection('users')
					.doc(user?.uid)
					.set({
						...userData,
					});

				await user.sendEmailVerification();
				return { success: true };
			}

			// const returnedUser = await db.collection('users').doc(user?.uid).get();
			// console.log(returnedUser.id);
			// await auth.currentUser?.sendEmailVerification();

			//return { id: returnedUser.id, ...returnedUser.data() };
			return { success: false };
		} catch (error: any) {
			console.log('Error @singup => ', error.message);
			return thunkApi.rejectWithValue({ message: error.message });
		}
	}
);

export const singupUser = async (
	userData: UserData
): Promise<{ success: boolean }> => {
	try {
		auth
			.createUserWithEmailAndPassword(
				userData.email.toLowerCase().trim(),
				userData.password!
			)
			.then((data) => {
				const { user } = data;
				delete userData['password'];
				if (user?.uid) {
					db.collection('users')
						.doc(user?.uid)
						.set({
							...userData,
						});
				}
				user?.sendEmailVerification();
				return { success: true };
			})
			.catch((er) => console.log(er));

		return { success: false };
	} catch (error) {
		return { success: false };
	}
};

export const login = createAsyncThunk(
	'auth/login',
	async (userData: { email: string; password: string }, thunkApi) => {
		try {
			const { user } = await auth.signInWithEmailAndPassword(
				userData.email.toLowerCase().trim(),
				userData.password
			);

			if (user?.uid) {
				if (user.emailVerified) {
					console.log('Is VErified', user.emailVerified);
					const returnedUser = await db.collection('users').doc(user.uid);
					returnedUser.update({ isVerified: true });
					const updated = await returnedUser.get();
					await AsyncStorage.setItem('sawOnBoarding', JSON.stringify('yes'));
					return { id: updated.id, ...updated.data() } as User;
				} else {
					return thunkApi.rejectWithValue('Email is not verified');
				}
			}
		} catch (error: any) {
			console.log('Error @ signup => ', error.message);
			throw new Error(error.message);
			//return thunkApi.rejectWithValue({ error: error.message });
		}
	}
);

export const isUserVerifiedAndActive = async (
	userId: string
): Promise<boolean> => {
	try {
		const user = (
			await db.collection('users').doc(userId).get()
		).data() as Contractor;
		if (user.isActive) {
			return true;
		}

		return false;
	} catch (error) {
		console.log(error);
		return false;
	}
};

export const autoSignInUser = createAsyncThunk(
	'auth/autoSign',
	async (userId: string, thunkApi) => {
		try {
			const user = await db.collection('users').doc(userId).get();
			if (user.exists) {
				const data = user.data() as Contractor;
				if (data.isActive) {
					await AsyncStorage.setItem('hasSignedIn', JSON.stringify(user.id));
					return { id: user.id, ...user.data() } as User;
				}
			}

			return thunkApi.rejectWithValue({
				role: user?.data()?.role!,
			});
		} catch (error: any) {
			return thunkApi.rejectWithValue({ message: error.message });
		}
	}
);

export const logout = createAsyncThunk(
	'auth/logout',
	async (_, { dispatch, rejectWithValue }) => {
		try {
			console.log('Logging Out');
			await auth.signOut().finally(() => {
				dispatch(resetRequests());
			});
		} catch (error: any) {
			return rejectWithValue({ message: error.message });
		}
	}
);
