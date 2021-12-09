import { createSlice } from '@reduxjs/toolkit';
import { Log } from '../../types';
import { addPrice, deletePrice, Price } from './logsActions';

interface LogsState {
	logs: Log[];
	prices: Price[];
	loading: boolean;
}
const initialState: LogsState = {
	logs: [],
	prices: [],
	loading: false,
};

const logsSlide = createSlice({
	name: 'logs',
	initialState,
	reducers: {
		getLogsByRequestId: (state, { payload }) => {
			state.loading = false;
			state.logs = payload;
		},

		getPricesByRequestId: (state, { payload }) => {
			state.loading = false;
			state.prices = payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(addPrice.pending, (state, { payload }) => {
				state.loading = true;
			})
			.addCase(addPrice.fulfilled, (state, { payload }) => {
				state.loading = false;
				state.prices.push(payload as Price);
			})
			.addCase(deletePrice.pending, (state, { payload }) => {
				state.loading = true;
			})
			.addCase(deletePrice.fulfilled, (state, { payload }) => {
				state.loading = false;
				state.prices = state.prices.filter((p) => p.id !== payload);
			});
	},
});

export const { getLogsByRequestId, getPricesByRequestId } = logsSlide.actions;

export default logsSlide.reducer;
