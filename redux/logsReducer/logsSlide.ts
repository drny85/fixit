import { createSlice } from '@reduxjs/toolkit';
import { Log } from '../../types';

interface LogsState {
	logs: Log[];
	loading: boolean;
}
const initialState: LogsState = {
	logs: [],
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
	},
	extraReducers: {},
});

export const { getLogsByRequestId } = logsSlide.actions;

export default logsSlide.reducer;
