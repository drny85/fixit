import { createAsyncThunk } from '@reduxjs/toolkit';
import { Service } from '../../constants/Services';
import { Contractor } from '../../constants/Contractors';
import { db } from '../../firebase';
import { Log, User } from '../../types';
import { saveOrChangeImageToDatabase } from '../../utils/saveImages';
import { RootState } from '../store';

export interface Request {
	contractor?: Contractor;
	id?: string;
	customer?: User;
	userId: string;
	service: Service | null;
	description: string;
	serviceDate: string;
	dateCompleted?: string | null;
	serviceTime: string;
	apt: string | null;
	logs?: Log[];
	status:
		| 'under review'
		| 'accepted'
		| 'pending'
		| 'approved'
		| 'working on'
		| 'completed'
		| 'declided';
	contactMethod: 'phone' | 'email';
	receivedOn: string;
	serviceAddress?: string;
	images?: string[];
}

export const addRequest = createAsyncThunk(
	'requests/addRequest',
	async (request: Request, { getState, rejectWithValue }) => {
		try {
			const data = await db.collection('requests').add(request);
			if (data.id) {
				await saveOrChangeImageToDatabase(request.images, data.id);
			}
			return true;
		} catch (error) {
			return rejectWithValue({ message: 'error adding request' });
		}
	}
);

export const getRequestsByContractor = createAsyncThunk(
	'requests/getRequestByWorker',
	async (contractorId: string, { rejectWithValue }) => {
		try {
			const res = await db
				.collection('requests')
				.where('contractorId', '==', contractorId)
				.onSnapshot((snapshot) =>
					snapshot.docs.map((doc) => {
						const data = [];
						if (doc.exists) {
							data.push({ id: doc.id, ...doc.data() });
						}

						return data as Request[];
					})
				);

			return res;
		} catch (error: any) {
			return rejectWithValue({ message: error.message });
		}
	}
);

export const getMyRequests = createAsyncThunk(
	'requests/getMyRequest',
	async (_, { getState, rejectWithValue }) => {
		try {
			const {
				auth: { user },
			} = getState() as RootState;

			const data = await db
				.collection('requests')
				.where('userId', '==', user?.id)
				.orderBy('receivedOn', 'desc')
				.get();

			const res = await data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

			return res as Request[];
		} catch (error: any) {
			console.log(error);
			return rejectWithValue({ message: error.message });
		}
	}
);

export const getRequestByUserIdAndRequestId = createAsyncThunk(
	'requests/getRequestByUserIdAndRequestId',
	async (requestId: string, { getState, rejectWithValue }) => {
		try {
			const res = await db.collection('requests').doc(requestId).get();

			return { id: res.id, ...res.data() } as Request;
		} catch (error: any) {
			return rejectWithValue({ message: error.message });
		}
	}
);

export const updateRequest = createAsyncThunk(
	'requests/updateRequest',
	async (request: Request, { rejectWithValue }) => {
		try {
			const res = await db.collection('requests').doc(request.id);
			await res.set(request, { merge: true });
			const data = await res.get();

			return { id: data.id, ...data.data() } as Request;
		} catch (error) {
			return rejectWithValue({ message: error });
		}
	}
);
