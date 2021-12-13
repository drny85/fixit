import { AdminTabParamList, RootTabParamList } from '../../types';
import React, { FC } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { FontAwesome, Feather } from '@expo/vector-icons';
import { useAppSelector } from '../../redux/store';
import HomeStack from '../consumer/HomeStack';
import { Messages, SettingsScreen } from '../../screens';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import RequestStack from '../consumer/RequestStack';
import { Loader } from '../../components';
import AdminStack from './DashboardStack';
import DashboardStack from './DashboardStack';
import AdminContractorStack from './AdminContractorStack';
import AdminSettings from '../../screens/adminScreens/AdminSettings';

function TabBarIcon(props: {
	name: React.ComponentProps<typeof Feather>['name'];
	color?: string;
}) {
	const theme = useAppSelector((state) => state.theme);

	return (
		<Feather
			size={30}
			style={{ marginBottom: -3 }}
			{...props}
			color={theme.PRIMARY_BUTTON_COLOR}
		/>
	);
}

const { Navigator, Screen } = createBottomTabNavigator<AdminTabParamList>();

const AdminTabsNavigation: FC = () => {
	const theme = useAppSelector((state) => state.theme);
	const { user, loading } = useAppSelector((state) => state.auth);

	return (
		<Navigator
			screenOptions={{
				headerShown: false,
				tabBarStyle: {
					backgroundColor: theme.BACKGROUND_COLOR,
				},
				tabBarActiveTintColor: theme.TEXT_COLOR,
				tabBarLabelStyle: { fontFamily: 'montserrat' },
				tabBarActiveBackgroundColor:
					theme.mode === 'dark' ? '#272729' : '#b9adad7d',
			}}
		>
			<Screen
				name='DashboardStack'
				component={DashboardStack}
				options={({ route }) => {
					const routeName = getFocusedRouteNameFromRoute(route);

					return {
						title: 'Dashboard',
						tabBarIcon: ({ focused, color, size }) => (
							<TabBarIcon name='home' />
						),
						tabBarVisible: routeName !== 'SuccessScreen',
					};
				}}
			/>
			<Screen
				name='ContractorsDashboard'
				component={AdminContractorStack}
				options={{
					title: 'Contractors',
					tabBarIcon: ({ focused, color, size }) => <TabBarIcon name='users' />,
				}}
			/>
			<Screen
				name='AdminSettingsDashboard'
				component={AdminSettings}
				options={{
					title: 'Settings',
					tabBarIcon: ({ focused, color, size }) => (
						<TabBarIcon name='settings' />
					),
				}}
			/>
		</Navigator>
	);
};

export default AdminTabsNavigation;
