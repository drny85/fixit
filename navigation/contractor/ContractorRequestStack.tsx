import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ContractorResquestsScreen from '../../screens/contractorScreens/requests/ContractorResquestsScreen';
import ContractorRequestDetails from '../../screens/contractorScreens/requests/ContractorRequestDetails';
import { ContractorRequestStackParams } from '../../types';

const { Navigator, Screen } =
	createNativeStackNavigator<ContractorRequestStackParams>();

const ContractorRequestStack = () => {
	return (
		<Navigator screenOptions={{ headerShown: false }}>
			<Screen
				name='ContractorResquestsScreen'
				component={ContractorResquestsScreen}
			/>
			<Screen
				name='ContractorRequestDetails'
				component={ContractorRequestDetails}
			/>
		</Navigator>
	);
};

export default ContractorRequestStack;
