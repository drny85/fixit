import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ContractorHomeStack from './ContractorHomeStack';
import { Feather } from '@expo/vector-icons';
import { useAppSelector } from '../../redux/store';
import ContractorRequestStack from './ContractorRequestStack';
import ContractorProfileScreen from '../../screens/contractorScreens/profile/ContractorProfileScreen';
import { ContractorNavigationRootParams } from '../../types';
import ContractorMessageStack from './ContractorMessageStack';

const { Navigator, Screen } =
	createBottomTabNavigator<ContractorNavigationRootParams>();

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

const ContractorTabsNavigation = () => {
	const theme = useAppSelector((state) => state.theme);
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
				component={ContractorHomeStack}
				options={{
					title: 'Home',
					tabBarIcon: ({ focused, color, size }) => <TabBarIcon name='home' />,
				}}
			/>
			<Screen
				name='ContractorRequestStack'
				component={ContractorRequestStack}
				options={{
					title: 'Requests',
					tabBarIcon: ({ focused, color, size }) => (
						<TabBarIcon name='layers' />
					),
				}}
			/>
			<Screen
				name='ContractorMessageStack'
				component={ContractorMessageStack}
				options={{
					title: 'Message',
					tabBarIcon: ({ focused, color, size }) => (
						<TabBarIcon name='message-square' />
					),
				}}
			/>

			<Screen
				name='ContractorProfileStack'
				component={ContractorProfileScreen}
				options={{
					title: 'Me',
					tabBarIcon: ({ focused, color, size }) => <TabBarIcon name='user' />,
				}}
			/>
		</Navigator>
	);
};

export default ContractorTabsNavigation;
