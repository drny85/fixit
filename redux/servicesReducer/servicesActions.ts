import { createAsyncThunk } from '@reduxjs/toolkit';
import { Service } from '../../constants/Services';
import { db } from '../../firebase';

export const getServices = createAsyncThunk<Service[]>(
	'services/getServices',
	async (_, thunkApi) => {
		try {
			const res = (
				await db.collection('services').orderBy('name').get()
			).docs.map((doc) => {
				if (doc.exists) {
					return { id: doc.id, ...doc.data() };
				}
			});
			return res as Service[];
		} catch (error: any) {
			return thunkApi.rejectWithValue({ error: error.message });
		}
	}
);

export const addService = createAsyncThunk(
	'services/addService',
	async (service: Service, thunkApi) => {
		try {
			await db.collection('services').add(service);
		} catch (error: any) {
			return thunkApi.rejectWithValue({ message: error.message });
		}
	}
);
