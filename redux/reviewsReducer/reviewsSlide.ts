import { createSlice } from '@reduxjs/toolkit';
import { Review } from '../../constants/Contractors';

import { getReviewsByContractor } from './reviewsAction';

interface IState {
	reviews: Review[];
	loading: boolean;
}

const initialState: IState = {
	reviews: [],
	loading: false,
};

const reviewsSlide = createSlice({
	name: 'reviews',
	initialState,
	reducers: {
		getReviews: (state, { payload }) => {
			state.reviews = (payload as Review[]).sort((a, b) =>
				a?.addedOn! < b?.addedOn! ? 1 : -1
			);
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getReviewsByContractor.pending, (state) => {
				state.loading = true;
			})
			.addCase(getReviewsByContractor.fulfilled, (state, { payload }) => {
				state.loading = false;
				state.reviews = payload as Review[];
			});
	},
});

export const { getReviews } = reviewsSlide.actions;

export default reviewsSlide.reducer;
