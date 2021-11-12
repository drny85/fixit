import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ContractorHomeStack from './ContractorHomeStack';
import { Feather } from '@expo/vector-icons';
import { useAppSelector } from '../../redux/store';

const { Navigator, Screen } = createBottomTabNavigator();

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
				name='ContractorRequestsScreen'
				component={ContractorHomeStack}
				options={{
					title: 'Requests',
					tabBarIcon: ({ focused, color, size }) => (
						<TabBarIcon name='layers' />
					),
				}}
			/>
		</Navigator>
	);
};

export default ContractorTabsNavigation;
