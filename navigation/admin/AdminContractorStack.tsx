import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ContractorsDashboard from '../../screens/adminScreens/ContractorsDashboard';
import AdminContractorDetails from '../../screens/adminScreens/AdminContractorDetails';
import { ContractorsDashboardParams } from '../../types';

const { Navigator, Screen } =
	createNativeStackNavigator<ContractorsDashboardParams>();

const AdminContractorStack = () => {
	return (
		<Navigator
			screenOptions={{ headerShown: false, animation: 'slide_from_bottom' }}
		>
			<Screen
				name='AdminContractorsDashboard'
				component={ContractorsDashboard}
			/>
			<Screen
				name='AdminContractorDetails'
				component={AdminContractorDetails}
			/>
		</Navigator>
	);
};

export default AdminContractorStack;
