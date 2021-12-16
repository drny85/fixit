import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ConsumerHomeStackParams } from '../../types';
import {
	Home,
	RequestServiceScreen,
	SuccessScreen,
	ContractorByJob,
	ContractorScreen,
} from '../../screens';

const { Navigator, Screen } =
	createNativeStackNavigator<ConsumerHomeStackParams>();

const HomeStack = () => {
	return (
		<Navigator screenOptions={{ animation: 'slide_from_bottom' }}>
			<Screen
				name='ConsumerHome'
				component={Home}
				options={{ headerShown: false }}
			/>
			<Screen
				name='ContractorByJob'
				component={ContractorByJob}
				options={{ headerShown: false }}
			/>
			<Screen
				name='ContractorsScreen'
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
