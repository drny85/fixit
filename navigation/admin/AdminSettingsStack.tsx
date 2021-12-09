import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AdminSettingsDashboardParams } from '../../types';
import AdminSettings from '../../screens/adminScreens/AdminSettings';

const { Navigator, Screen } =
	createNativeStackNavigator<AdminSettingsDashboardParams>();

const AdminSettingsStack = () => {
	return (
		<Navigator
			screenOptions={{ headerShown: false, animation: 'slide_from_bottom' }}
		>
			<Screen name='AdminSettingDashboard' component={AdminSettings} />
		</Navigator>
	);
};

export default AdminSettingsStack;
