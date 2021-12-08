import { createAsyncThunk } from '@reduxjs/toolkit';
import { Review } from '../../constants/Contractors';
import { db } from '../../firebase';

export const getReviewsByContractor = createAsyncThunk(
	'reviews/getReviews',
	async (contractorId: string, { rejectWithValue }) => {
		try {
			const reviews = await (
				await db
					.collection('reviews')
					.doc(contractorId)
					.collection('reviews')
					.get()
			).docs.map((doc) => {
				if (doc.exists) {
					return { id: doc.id, ...doc.data() } as Review;
				}
			});

			return reviews.sort((a, b) =>
				a?.addedOn! < b?.addedOn! ? 1 : -1
			) as Review[];
		} catch (error) {
			return rejectWithValue({ message: error });
		}
	}
);

export const addReview = createAsyncThunk(
	'reviews/addReview',
	async (review: Review, { rejectWithValue }) => {
		try {
			await db
				.collection('reviews')
				.doc(review.contractorId)
				.collection('reviews')
				.add(review);
			await db.collection('requests');
			return true;
		} catch (error) {
			return rejectWithValue({ message: error });
		}
	}
);
