/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */
import { CompositeNavigationProp } from '@react-navigation/core';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Service } from './constants/Services';
import { Contractor } from './constants/Contractors';
import { Request } from './redux/requestReducer/requestActions';
import { UserData } from './redux/authReducer/authActions';

// declare global {
// 	namespace ReactNavigation {
// 		interface RootParamList extends RootStackParamList {}
// 	}
// }

export interface RootStackParamList extends AdminTabParamList {
	Home: NavigatorScreenParams<HomeStackParamList> | undefined;
	Contractosr: NavigatorScreenParams<HomeStackParamList> | undefined;
	ContractorScreen: NavigatorScreenParams<HomeStackParamList> | undefined;
	RequestServiceScreen: NavigatorScreenParams<HomeStackParamList> | undefined;
}

export type HomeStackParamList = {
	Home: { service: Service };
	Contractors: { contractor: Contractor };
	ContractorScreen: undefined;
	RequestServiceScreen: undefined;
	SuccessScreen: undefined;
};

// export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
// 	NativeStackScreenProps<RootStackParamList, Screen>;

export type RootTabParamList = {
	HomeStacks: undefined;
	RequestStacks: undefined;
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
	ConnectedAccountScreen: undefined;
};

export type AdminTabParamList = {
	DashboardStack: NavigatorScreenParams<DashboardStackParams> | undefined;
	ContractorsDashboard:
		| NavigatorScreenParams<ContractorsDashboardParams>
		| undefined;
	AdminSettingsDashboard:
		| NavigatorScreenParams<AdminSettingsDashboardParams>
		| undefined;
};

export type DashboardStackParams = {
	Dashboard: undefined;
};
export type ContractorsDashboardParams = {
	AdminContractorsDashboard: { contractorStatus: 'new' | 'active' };
	AdminContractorDetails: { contractorId: string | undefined };
};
export type AdminSettingsDashboardParams = {
	AdminSettingDashboard: undefined;
};

export type RequestStatus =
	| 'under review'
	| 'accepted'
	| 'pending'
	| 'approved'
	| 'working on'
	| 'completed'
	| 'declided'
	| 'waiting for payment'
	| undefined;

export type AuthTabParamList = {
	LoginScreen: undefined;
	SignUpScreen: undefined;
	Success: { email: string; signupType: 'consumer' | 'contractor' };
	OnBoardingScreen: undefined;
	SignUpAsContractor: undefined;
	SignupStatus: { contractor: Contractor };
	ForgotPasswordScreen: { email: string } | undefined;
};
export type RequestTabParamList = {
	RequestScreen: undefined;
	RequestDetails: { request?: Request };
	PaymentBreakDown: { request?: Request };
	PaymentScreen: { requestId: string };
	PaymentSuccess: undefined;
	ContractorScreen: { contractor: Contractor };
	Home: undefined;
};

export type ConsumerNavigationRootParams = {
	ConsumerHomeStack: NavigatorScreenParams<ConsumerHomeStackParams> | undefined;
	ConsumerRequestStack:
		| NavigatorScreenParams<ConsumerRequestStackParams>
		| undefined;
	ConsumerMessageStack:
		| NavigatorScreenParams<ConsumerMessageStackParams>
		| undefined;
	ConsumerProfileStack:
		| NavigatorScreenParams<ConsumerProfileStackParams>
		| undefined;
};

export type ConsumerHomeStackParams = {
	ConsumerHome: undefined;
	ContractorByJob: { contractor: Contractor };
	ContractorsScreen: undefined;
	RequestServiceScreen: undefined;
	SuccessScreen: undefined;
	CustomerProfileScreen: undefined;
};
export type ConsumerRequestStackParams = {};
export type ConsumerMessageStackParams = {
	ConsumerMessageScreen: { request: Request };
	ConsumerMessageDetails: { request: Request };
};
export type ConsumerProfileStackParams = {
	ConsumerProfile: undefined;
};

export type ContractorNavigationRootParams = {
	ContractorHomeStack:
		| NavigatorScreenParams<ContractorHomeStackParams>
		| undefined;
	ContractorRequestStack:
		| NavigatorScreenParams<ContractorRequestStackParams>
		| undefined;
	ContractorMessageStack:
		| NavigatorScreenParams<ContractorMessageStackParams>
		| undefined;
	ContractorProfileStack:
		| NavigatorScreenParams<ContractorProfileStackParams>
		| undefined;
};

export type ContractorHomeStackParams = {
	ContractorHome: undefined;
	ConnectedAccountScreen: undefined;
};
export type ContractorRequestStackParams = {
	ContractorResquestsScreen: { requestsStatus: Request['status'] } | undefined;
	ContractorRequestDetails: { request: Request };
};
export type ContractorMessageStackParams = {
	ContractorMessageScreen: undefined;
	ContractorMessageDetails: { request: Request };
};
export type ContractorProfileStackParams = {};

export type HomeScreenNavigationProp = CompositeNavigationProp<
	BottomTabNavigationProp<RootTabParamList, 'HomeStacks'>,
	NativeStackNavigationProp<HomeTabParamList>
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
	DONE_COLOR: string;
	SECONDARY_BUTTON_COLOR: string;
	STATUS_BAR: string;
	ASCENT: string;
}

export interface Log {
	id?: string;
	requestId: string;
	body: string;
	connectedId: string;
	cost: number | null;
	loggedOn: string;
	price_id?: string;
	customer_id?: string;
}
