import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ContractorHome from '../../screens/contractorScreens/ContractorHome';

const { Navigator, Screen } = createNativeStackNavigator();

const ContractorHomeStack = () => {
	return (
		<Navigator screenOptions={{ headerShown: false }}>
			<Screen name='ContractorHome' component={ContractorHome} />
		</Navigator>
	);
};

export default ContractorHomeStack;
