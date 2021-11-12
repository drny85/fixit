import { createAsyncThunk } from '@reduxjs/toolkit';
import { Contractor } from '../../constants/Contractors';
import { db } from '../../firebase';

export const addApplicant = createAsyncThunk(
	'applicants/addApplicants',
	async (applicant: Contractor, { rejectWithValue }) => {
		try {
			await db.collection('applicants').add(applicant);
		} catch (error: any) {
			rejectWithValue({ message: error.message });
		}
	}
);
