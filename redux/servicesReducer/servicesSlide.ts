import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Service } from '../../constants/Services';
import { db } from '../../firebase';
import { AppThunk } from '../store';
import { getServices } from './servicesActions';

interface IState {
	loading: boolean;
	error: string;
	services: Service[];
	servicesSelected: Service[];
	selectedService: Service | null;
	contactMethod: 'phone' | 'email';
}

const initialState: IState = {
	loading: false,
	services: [],
	servicesSelected: [],
	error: '',
	selectedService: null,
	contactMethod: 'phone',
};

const servicesSlide = createSlice({
	name: 'services',
	initialState,
	reducers: {
		setSelectedService: (state, { payload }: PayloadAction<Service>) => {
			state.selectedService = payload;
		},
		setContactmethod: (
			state,
			{ payload }: PayloadAction<'phone' | 'email'>
		) => {
			state.contactMethod = payload;
		},
		setServicesSelected: (state, { payload }: PayloadAction<Service[]>) => {
			state.loading = false;
			state.servicesSelected = payload;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(getServices.pending, (state) => {
			state.loading = true;
		});
		builder.addCase(getServices.fulfilled, (state, { payload }) => {
			state.loading = false;
			state.services = payload;
		});
		builder.addCase(getServices.rejected, (state, { error }) => {
			console.log(error.message);
		});
	},
});

export const { setSelectedService, setContactmethod, setServicesSelected } =
	servicesSlide.actions;

export default servicesSlide.reducer;
