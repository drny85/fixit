import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { User } from '../../types';
import { Request } from '../requestReducer/requestActions';
import { autoSignInUser, login, logout, signup, UserData } from './authActions';

interface AuthState {
	isAuthenticated: boolean;
	user: User | null;
	isVerified: boolean;
	role: 'admin' | 'consumer' | 'contractor' | undefined;
	loading: boolean;
	error?: string | null;
	users: User[];
}

const initialState: AuthState = {
	isAuthenticated: false,
	user: null,
	isVerified: false,
	role: undefined,
	loading: false,
	users: [],
	error: null,
};

const authSlide = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setUserRole: (state, { payload }) => {
			(state.loading = false), (state.role = payload);
		},
		setUsers: (state, { payload }) => {
			(state.loading = false), (state.users = payload);
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(login.pending, (state) => {
				state.error = null;
				state.loading = true;
			})
			.addCase(login.rejected, (state, { error }) => {
				state.loading = false;
				state.error = error.message;
				state.user = null;
				state.isAuthenticated = false;
			})
			.addCase(login.fulfilled, (state, { payload }) => {
				state.error = null;
				state.loading = false;
				state.isAuthenticated = true;
				state.user = payload as User;
			})
			.addCase(signup.rejected, (state, { error }) => {
				console.log('EEE', error);
				state.loading = false;
				state.user = null;
				state.error = error.message;
				state.isAuthenticated = false;
			})
			.addCase(signup.fulfilled, (state, { payload }) => {
				console.log('PAYLOAD', payload);
				state.error = null;
				state.loading = false;
			})
			.addCase(autoSignInUser.fulfilled, (state, { payload }) => {
				state.loading = false;
				state.user = payload as User;
				state.isAuthenticated = true;
			})
			.addCase(autoSignInUser.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(autoSignInUser.rejected, (state, { error }) => {
				state.loading = false;
				state.error = error.message;
			})
			.addCase(logout.rejected, (state, { error }) => {
				state.loading = false;
				state.error = error.message;
				state.role = undefined;
			})
			.addCase(logout.fulfilled, (state) => {
				state.error = null;
				state.loading = false;
				state.isAuthenticated = false;
				state.user = null;
				state.role = undefined;
			});
	},
});

export const { setUserRole, setUsers } = authSlide.actions;

export default authSlide.reducer;
