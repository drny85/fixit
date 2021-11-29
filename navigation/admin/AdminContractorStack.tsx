import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ContractorsDashboard from '../../screens/adminScreens/ContractorsDashboard';
import AdminContractorDetails from '../../screens/adminScreens/AdminContractorDetails';

const { Navigator, Screen } = createNativeStackNavigator();

const AdminContractorStack = () => {
	return (
		<Navigator
			screenOptions={{ headerShown: false, animation: 'slide_from_bottom' }}
		>
			<Screen name='ContractorsDashboard' component={ContractorsDashboard} />
			<Screen
				name='AdminContractorDetails'
				component={AdminContractorDetails}
			/>
		</Navigator>
	);
};

export default AdminContractorStack;
