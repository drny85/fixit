import { lightTheme } from "./../../Theme";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Theme } from "../../types";
import { DefaultTheme } from "styled-components/native";
import { RootState } from "../store";

const initialState: DefaultTheme = lightTheme;

const themeSlide = createSlice({
	name: "theme",
	initialState,
	reducers: {
		switchTheme: (state, { payload }: PayloadAction<Theme>) => payload,
	},
});

export const theme = (state: RootState) => state.theme;

export const { switchTheme } = themeSlide.actions;

export default themeSlide.reducer;
