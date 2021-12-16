import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ContractorHome from '../../screens/contractorScreens/home/ContractorHome';
import ConnectedAccountScreen from '../../screens/contractorScreens/ConnectedAccountScreen';
import { ContractorHomeStackParams } from '../../types';

const { Navigator, Screen } =
	createNativeStackNavigator<ContractorHomeStackParams>();

const ContractorHomeStack = () => {
	return (
		<Navigator screenOptions={{ headerShown: false }}>
			<Screen name='ContractorHome' component={ContractorHome} />
			<Screen
				name='ConnectedAccountScreen'
				component={ConnectedAccountScreen}
			/>
		</Navigator>
	);
};

export default ContractorHomeStack;
