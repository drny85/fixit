import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';

import useCachedResources from './hooks/useCachedResources';

import AuthStack from './navigation/AuthStack';
import store, { useAppSelector } from './redux/store';
import { ThemeProvider } from 'styled-components';
import { LogBox } from 'react-native';
import AdminTabsNavigation from './navigation/admin/AdminTabsNavigation';
import ContractorTabsNavigation from './navigation/contractor/ContractorTabsNavigation';
import ConsumerTabsNavigation from './navigation/consumer/ConsumerTabsNavigation';
import { Loader } from './components';

LogBox.ignoreAllLogs();

const App: React.FC = () => {
	const isLoadingComplete = useCachedResources();
	const { user, loading, role } = useAppSelector((state) => state.auth);
	const theme = useAppSelector((state) => state.theme);

	if (!isLoadingComplete || loading) {
		return <Loader />;
	}

	return (
		<ThemeProvider theme={theme}>
			<SafeAreaProvider>
				<NavigationContainer>
					{user && user.role === 'admin' && role === 'admin' ? (
						<AdminTabsNavigation />
					) : user && user.role === 'contractor' && role === 'contractor' ? (
						<ContractorTabsNavigation />
					) : user && user.role === 'consumer' && role === 'consumer' ? (
						<ConsumerTabsNavigation />
					) : (
						<AuthStack />
					)}

					<StatusBar style='auto' />
				</NavigationContainer>
			</SafeAreaProvider>
		</ThemeProvider>
	);
};

export default () => {
	return (
		<Provider store={store}>
			<App />
		</Provider>
	);
};
