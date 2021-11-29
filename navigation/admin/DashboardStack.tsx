import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Dashboard from '../../screens/adminScreens/Dashboard';
import ContractorsDashboard from '../../screens/adminScreens/ContractorsDashboard';
import { AdminTabParamList } from '../../types';

const { Navigator, Screen } = createNativeStackNavigator<AdminTabParamList>();

const DashboardStack = () => {
	return (
		<Navigator
			screenOptions={{ headerShown: false, animation: 'slide_from_bottom' }}
		>
			<Screen name='Dashboard' component={Dashboard} />
			<Screen name='ContractorsDashboard' component={ContractorsDashboard} />
		</Navigator>
	);
};

export default DashboardStack;
