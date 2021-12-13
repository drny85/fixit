import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Contractor } from '../../constants/Contractors';

interface IState {
	contractors: Contractor[];
	selectedContractor: Contractor | null;
	error: string | null;
	loading: boolean;
	contratorsFiltered: Contractor[];
}

const initialState: IState = {
	contractors: [],
	selectedContractor: null,
	contratorsFiltered: [],
	error: null,
	loading: false,
};

const contractorsSlide = createSlice({
	name: 'contractors',
	initialState,
	reducers: {
		getContractors: (state, { payload }: PayloadAction<Contractor[]>) => {
			state.contractors = payload;
		},
		getContractorByJob: (state, { payload }: PayloadAction<string>) => {
			state.contratorsFiltered = state.contractors.filter((w) =>
				w.services.some((n) => n!.name!.toLowerCase() === payload.toLowerCase())
			);
		},
		setSelectedContractor: (state, { payload }: PayloadAction<Contractor>) => {
			state.selectedContractor = payload;
		},
	},
	extraReducers: (builder) => {},
});

export const { getContractors, getContractorByJob, setSelectedContractor } =
	contractorsSlide.actions;

export default contractorsSlide.reducer;
