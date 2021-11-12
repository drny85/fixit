/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */
import { CompositeNavigationProp } from '@react-navigation/core';
import {
	BottomTabNavigationProp,
	BottomTabScreenProps,
} from '@react-navigation/bottom-tabs';
import {
	CompositeScreenProps,
	NavigatorScreenParams,
} from '@react-navigation/native';
import {
	NativeStackNavigationProp,
	NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { Service } from './constants/Services';
import { Contractor } from './constants/Contractors';
import { Request } from './redux/requestReducer/requestActions';
import { UserData } from './redux/authReducer/authActions';

declare global {
	namespace ReactNavigation {
		interface RootParamList extends RootStackParamList {}
	}
}

export type RootStackParamList = {
	Home: NavigatorScreenParams<HomeStackParamList> | undefined;
	Contractosr: NavigatorScreenParams<HomeStackParamList> | undefined;
	ContractorScreen: NavigatorScreenParams<HomeStackParamList> | undefined;
	RequestServiceScreen: NavigatorScreenParams<HomeStackParamList> | undefined;
};

export type HomeStackParamList = {
	Home: { service: Service };
	Contractors: { contractor: Contractor };
	ContractorScreen: undefined;
	RequestServiceScreen: undefined;
	SuccessScreen: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
	NativeStackScreenProps<RootStackParamList, Screen>;

export type RootTabParamList = {
	HomeStack: undefined;
	OrdersStack: undefined;
	CartStack: undefined;
	ProfileStack: undefined;
	AdminStack: undefined;
};
export type HomeTabParamList = {
	Home: undefined;
	Contractors: { service: Service };
	ContractorScreen: { contractor: Contractor };
	RequestServiceScreen: { contractor: Contractor };
	SuccessScreen: undefined;
};

export type SettingsTabParamList = {
	Profile: undefined;
};
export type AuthTabParamList = {
	LoginScreen: undefined;
	SignUpScreen: undefined;
	Success: { email: string; signupType: 'consumer' | 'contractor' };
	OnBoardingScreen: undefined;
	SignUpAsContractor: undefined;
	SignupStatus: { contractor: Contractor };
};
export type RequestTabParamList = {
	RequestScreen: undefined;
	RequestDetails: { request?: Request };
	ContractorScreen: { contractor: Contractor };
	Home: undefined;
};

export type HomeScreenNavigationProp = CompositeNavigationProp<
	BottomTabNavigationProp<RootTabParamList, 'HomeStack'>,
	NativeStackNavigationProp<HomeTabParamList>
>;

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
	CompositeScreenProps<
		BottomTabScreenProps<RootTabParamList, Screen>,
		NativeStackScreenProps<RootStackParamList>
	>;

export interface User extends Contractor {
	isActive: boolean;
	isVerified: boolean;
}

export interface Theme {
	mode: 'dark' | 'light' | string;
	BACKGROUND_COLOR: string;
	TEXT_COLOR: string;
	BUTTON_TEXT_COLOR: string;
	PRIMARY_BUTTON_COLOR: string;
	SHADOW_COLOR: string;
	SECONDARY_BUTTON_COLOR: string;
	STATUS_BAR: string;
	ASCENT: string;
}
