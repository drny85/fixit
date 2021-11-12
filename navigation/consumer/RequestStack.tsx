import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
	ContractorScreen,
	RequestDetails,
	RequestsScreen,
} from '../../screens';
import { RequestTabParamList } from '../../types';

const { Navigator, Screen } = createNativeStackNavigator<RequestTabParamList>();

const RequestStack: FC = () => {
	return (
		<Navigator>
			<Screen
				name='RequestScreen'
				component={RequestsScreen}
				options={{ headerShown: false }}
			/>
			<Screen
				name='RequestDetails'
				component={RequestDetails}
				options={{ headerShown: false }}
			/>
			<Screen
				name='ContractorScreen'
				component={ContractorScreen}
				options={{ headerShown: false }}
			/>
		</Navigator>
	);
};

export default RequestStack;
