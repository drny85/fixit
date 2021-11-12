import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HomeStackParamList } from '../../types';
import {
	Home,
	RequestServiceScreen,
	SuccessScreen,
	ContractorByJob,
	ContractorScreen,
} from '../../screens';

const { Navigator, Screen } = createNativeStackNavigator<HomeStackParamList>();

const HomeStack = () => {
	return (
		<Navigator screenOptions={{ animation: 'slide_from_bottom' }}>
			<Screen name='Home' component={Home} options={{ headerShown: false }} />
			<Screen
				name='Contractors'
				component={ContractorByJob}
				options={{ headerShown: false }}
			/>
			<Screen
				name='ContractorScreen'
				component={ContractorScreen}
				options={{ headerShown: false }}
			/>
			<Screen
				name='RequestServiceScreen'
				component={RequestServiceScreen}
				options={{ headerShown: false }}
			/>
			<Screen
				name='SuccessScreen'
				component={SuccessScreen}
				options={{ headerShown: false }}
			/>
		</Navigator>
	);
};
export default HomeStack;
