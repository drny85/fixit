import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import themeSlide from './themeReducer/themeSlide';

import { useSelector, TypedUseSelectorHook, useDispatch } from 'react-redux';
import servicesSlide from './servicesReducer/servicesSlide';

import authSlider from './authReducer/authSlider';
import requestSlide from './requestReducer/requestSlide';
import contractorsSlide from './contractorReducer/contractorsSlide';
import applicantsSlide from './applicantsReducer/applicantsSlide';
import reviewsSlide from './reviewsRedu/reviewsSlide';
import logsSlide from './logsReducer/logsSlide';

const reducer = {
	auth: authSlider,
	theme: themeSlide,
	services: servicesSlide,
	contractors: contractorsSlide,
	requests: requestSlide,
	applicants: applicantsSlide,
	reviews: reviewsSlide,
	logs: logsSlide,
};

const store = configureStore({
	reducer,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	unknown,
	Action<string>
>;

export default store;
