import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Contractor } from '../../constants/Contractors';
import { addApplicant } from './applicantsAction';

interface ISatate {
	applicants: Contractor[];
	currentApplicant: Contractor | null;
	loading: boolean;
	error: string | null;
}
const initialState: ISatate = {
	applicants: [],
	currentApplicant: null,
	loading: false,
	error: null,
};

const applicantsSlide = createSlice({
	name: 'applicants',
	initialState,
	reducers: {
		getApplicants: (state, { payload }: PayloadAction<Contractor[]>) => {
			(state.loading = false), (state.applicants = payload);
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(addApplicant.pending, (state) => {
				state.error = null;
				state.loading = true;
			})
			.addCase(addApplicant.fulfilled, (state) => {
				state.loading = false;
			})
			.addCase(addApplicant.rejected, (state, { error }) => {
				(state.loading = false), (state.error = error.message!);
			});
	},
});

export const { getApplicants } = applicantsSlide.actions;

export default applicantsSlide.reducer;
