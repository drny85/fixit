import { ContractorNavigationRootParams, RootTabParamList } from '../../types';
import React, { FC } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { FontAwesome } from '@expo/vector-icons';
import { useAppSelector } from '../../redux/store';

import { Messages, SettingsScreen } from '../../screens';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import RequestStack from './RequestStack';
import HomeStack from './HomeStack';
import ConsumerProfileStack from './ConsumerProfileStack';
import ConsumerMessageStack from './ConsumerMessageStack';

function TabBarIcon(props: {
	name: React.ComponentProps<typeof FontAwesome>['name'];
	color?: string;
}) {
	const theme = useAppSelector((state) => state.theme);

	return (
		<FontAwesome
			size={30}
			style={{ marginBottom: -3 }}
			{...props}
			color={theme.PRIMARY_BUTTON_COLOR}
		/>
	);
}

const { Navigator, Screen } =
	createBottomTabNavigator<ContractorNavigationRootParams>();

const ConsumerTabsNavigation: FC = () => {
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
				name='ContractorHomeStack'
				component={HomeStack}
				options={({ route }) => {
					const routeName = getFocusedRouteNameFromRoute(route);

					return {
						title: user?.role === 'consumer' ? 'Services' : 'Home',
						tabBarIcon: ({ focused, color, size }) => (
							<TabBarIcon name='gears' />
						),
						tabBarVisible: routeName !== 'SuccessScreen',
					};
				}}
			/>
			<Screen
				name='ContractorRequestStack'
				component={RequestStack}
				options={{
					title: user?.role === 'consumer' ? 'My Requests' : 'My Jobs',
					tabBarIcon: ({ focused, color, size }) => (
						<TabBarIcon name='first-order' />
					),
				}}
			/>
			<Screen
				name='ContractorMessageStack'
				component={ConsumerMessageStack}
				options={{
					title: 'Messages',
					tabBarIcon: ({ focused, color, size }) => (
						<TabBarIcon name='comments' />
					),
				}}
			/>
			<Screen
				name='ContractorProfileStack'
				component={ConsumerProfileStack}
				options={{
					title: 'Profile',
					tabBarIcon: ({ focused, color, size }) => <TabBarIcon name='user' />,
				}}
			/>
		</Navigator>
	);
};

export default ConsumerTabsNavigation;
