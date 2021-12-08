import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ContractorHome from '../../screens/contractorScreens/ContractorHome';
import ConnectedAccountScreen from '../../screens/contractorScreens/ConnectedAccountScreen';

const { Navigator, Screen } = createNativeStackNavigator();

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
