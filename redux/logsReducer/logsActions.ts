import { createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../../firebase';
import { Log } from '../../types';
import { RootState } from '../store';

export interface Price {
	id?: string;
	requestId: string;
	cost: number;
	description: string;
	customer_id?: string;
	price_id?: string;
	createdOn?: string;
}

export const addLog = async (log: Log): Promise<boolean> => {
	try {
		await db.collection('logs').doc(log.requestId).collection('logs').add(log);
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
};

export const deleteLog = async (log: Log) => {
	try {
		await db
			.collection('logs')
			.doc(log.requestId)
			.collection('logs')
			.doc(log.id)
			.delete();
		return true;
	} catch (error) {
		return false;
	}
};

export const addPrice = createAsyncThunk(
	'prices/addPrice',
	async (priceData: Price, { rejectWithValue, getState }) => {
		try {
			const {
				auth: { user },
			} = getState() as RootState;
			await db
				.collection('prices')
				.doc(user?.id)
				.collection('prices')
				.add(priceData);
		} catch (error: any) {
			return rejectWithValue({ message: error.message });
		}
	}
);

export const deletePrice = createAsyncThunk(
	'prices/deletePrice',
	async (priceId: string, { rejectWithValue, getState }) => {
		try {
			const {
				auth: { user },
			} = getState() as RootState;
			await db
				.collection('prices')
				.doc(user?.id)
				.collection('prices')
				.doc(priceId)
				.delete();
		} catch (error: any) {
			return rejectWithValue({ message: error.message });
		}
	}
);
