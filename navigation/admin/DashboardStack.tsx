import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Dashboard from '../../screens/adminScreens/Dashboard';
import { DashboardStackParams } from '../../types';

const { Navigator, Screen } =
	createNativeStackNavigator<DashboardStackParams>();

const DashboardStack = () => {
	return (
		<Navigator
			screenOptions={{ headerShown: false, animation: 'slide_from_bottom' }}
		>
			<Screen name='Dashboard' component={Dashboard} />
		</Navigator>
	);
};

export default DashboardStack;
