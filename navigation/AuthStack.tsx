import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
	LoginScreen,
	OnBoardingScreen,
	SignUpAsContractor,
	SignUpScreen,
	Success,
} from '../screens';
import { AuthTabParamList } from '../types';
import SignupStatus from '../screens/authScreens/SignupStatus';
import ForgotPasswordScreen from '../screens/authScreens/ForgotPasswordScreen';

const { Navigator, Screen } = createNativeStackNavigator<AuthTabParamList>();

const AuthStack: FC = () => {
	return (
		<Navigator>
			<Screen
				name='OnBoardingScreen'
				component={OnBoardingScreen}
				options={{ headerShown: false }}
			/>
			<Screen
				name='LoginScreen'
				component={LoginScreen}
				options={{ headerShown: false }}
			/>
			<Screen
				name='SignUpScreen'
				component={SignUpScreen}
				options={{ headerShown: false }}
			/>
			<Screen
				name='Success'
				component={Success}
				options={{ headerShown: false }}
			/>
			<Screen
				name='SignUpAsContractor'
				component={SignUpAsContractor}
				options={{ headerShown: false }}
			/>
			<Screen
				name='SignupStatus'
				component={SignupStatus}
				options={{ headerShown: false }}
			/>

			<Screen
				name='ForgotPasswordScreen'
				component={ForgotPasswordScreen}
				options={{ headerShown: false }}
			/>
		</Navigator>
	);
};

export default AuthStack;
