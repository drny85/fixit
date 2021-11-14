import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ContractorResquestsScreen from '../../screens/contractorScreens/ContractorResquestsScreen';
import ContractorRequestDetails from '../../screens/contractorScreens/ContractorRequestDetails';

const { Navigator, Screen } = createNativeStackNavigator();

const ContractorRequestStack = () => {
	return (
		<Navigator screenOptions={{ headerShown: false }}>
			<Screen
				name='ContractorRequestScreen'
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
