import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ContractorMessageStackParams } from '../../types';
import ContractorMessagesScreen from '../../screens/contractorScreens/messages/ContractorMessagesScreen';
import ContractorMessadeDetails from '../../screens/contractorScreens/messages/ContractorMessadeDetails';

const { Navigator, Screen } =
	createNativeStackNavigator<ContractorMessageStackParams>();

const ContractorMessageStack = () => {
	return (
		<Navigator screenOptions={{ headerShown: false }}>
			<Screen
				name='ContractorMessageScreen'
				component={ContractorMessagesScreen}
			/>
			<Screen
				name='ContractorMessageDetails'
				component={ContractorMessadeDetails}
			/>
		</Navigator>
	);
};

export default ContractorMessageStack;
