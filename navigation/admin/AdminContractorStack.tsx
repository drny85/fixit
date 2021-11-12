import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ContractorsDashboard from '../../screens/adminScreens/ContractorsDashboard';

const { Navigator, Screen } = createNativeStackNavigator();

const AdminContractorStack = () => {
	return (
		<Navigator
			screenOptions={{ headerShown: false, animation: 'slide_from_bottom' }}
		>
			<Screen name='ContractorsDashboard' component={ContractorsDashboard} />
		</Navigator>
	);
};

export default AdminContractorStack;
