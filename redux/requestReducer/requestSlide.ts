import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
	addRequest,
	getMyRequests,
	getRequestByUserIdAndRequestId,
	getRequestsByContractor,
	Request,
	updateRequest,
} from './requestActions';

interface IState {
	requests: Request[];
	loading: boolean;
	request: Request | null;
	error?: string | null;
}

const initialState: IState = {
	requests: [],
	loading: false,
	request: null,
	error: null,
};

const requestSlide = createSlice({
	name: 'requests',
	initialState,
	reducers: {
		getRequests: (state, { payload }: PayloadAction<Request[]>) => {
			state.loading = false;
			state.requests = payload;
		},
		setRequest: (state, { payload }) => {
			state.loading = false;
			state.request = payload;
		},
		resetRequests: (state) => {
			state.loading = false;
			(state.requests = []), (state.request = null);
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(addRequest.pending, (state) => {
				state.loading = true;
			})
			.addCase(addRequest.fulfilled, (state, { payload }) => {
				state.loading = false;
				state.requests.push(payload as Request);
			})
			.addCase(getRequestsByContractor.pending, (state) => {
				state.loading = true;
			})
			.addCase(getRequestsByContractor.fulfilled, (state, { payload }) => {
				state.loading = false;
				state.requests = payload as Request[];
			})
			.addCase(getMyRequests.pending, (state) => {
				state.loading = true;
			})
			.addCase(getMyRequests.fulfilled, (state, { payload }) => {
				state.loading = false;
				state.requests = payload as Request[];
			})
			.addCase(getRequestByUserIdAndRequestId.pending, (state) => {
				state.error = null;
				state.loading = true;
			})
			.addCase(
				getRequestByUserIdAndRequestId.fulfilled,
				(state, { payload }) => {
					state.loading = false;
					state.error = null;
					state.request = payload as Request;
				}
			)
			.addCase(getRequestByUserIdAndRequestId.rejected, (state, { error }) => {
				state.error = error.message;
				state.loading = false;
				state.request = null;
			})
			.addCase(updateRequest.pending, (state) => {
				state.loading = true;
			})
			.addCase(updateRequest.fulfilled, (state, { payload }) => {
				(state.loading = false), (state.request = payload as Request);
			});
	},
});

export const { getRequests, resetRequests, setRequest } = requestSlide.actions;

export default requestSlide.reducer;
