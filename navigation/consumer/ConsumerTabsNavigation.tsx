import { RootTabParamList } from '../../types';
import React, { FC } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { FontAwesome } from '@expo/vector-icons';
import { useAppSelector } from '../../redux/store';

import { Messages, SettingsScreen } from '../../screens';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import RequestStack from './RequestStack';
import HomeStack from './HomeStack';

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

const { Navigator, Screen } = createBottomTabNavigator<RootTabParamList>();

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
				name='HomeStacks'
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
				name='RequestStacks'
				component={RequestStack}
				options={{
					title: user?.role === 'consumer' ? 'My Requests' : 'My Jobs',
					tabBarIcon: ({ focused, color, size }) => (
						<TabBarIcon name='first-order' />
					),
				}}
			/>
			<Screen
				name='CartStack'
				component={Messages}
				options={{
					title: 'Messages',
					tabBarIcon: ({ focused, color, size }) => (
						<TabBarIcon name='comments' />
					),
				}}
			/>
			<Screen
				name='ProfileStack'
				component={SettingsScreen}
				options={{
					title: 'Profile',
					tabBarIcon: ({ focused, color, size }) => <TabBarIcon name='user' />,
				}}
			/>
		</Navigator>
	);
};

export default ConsumerTabsNavigation;
