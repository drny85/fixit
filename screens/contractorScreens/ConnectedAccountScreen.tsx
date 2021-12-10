import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, useEffect, useRef, useState } from 'react';
import { View, Text } from 'react-native';

import { WebView, WebViewNavigation, WebViewProps } from 'react-native-webview';
import { Loader, Screen } from '../../components';
import { SIZES } from '../../constants';
import { functions } from '../../firebase';
import { useAppSelector } from '../../redux/store';
import { HomeTabParamList } from '../../types';
import * as Linking from 'expo-linking';
import { autoSignInUser } from '../../redux/authReducer/authActions';
import { useDispatch } from 'react-redux';

type Props = NativeStackScreenProps<HomeTabParamList, 'ConnectedAccountScreen'>;

const ConnectedAccountScreen: FC<Props> = ({ route, navigation }) => {
	const { user } = useAppSelector((state) => state.auth);
	const webViewRef = useRef<any>();
	const dispatch = useDispatch();
	const [processing, setProcessing] = useState<boolean>(true);
	const [currentUrl, setCurrentUrl] = useState<string | null>(null);
	const handleNavigationChanges = async (newNavState: WebViewNavigation) => {
		const { url, loading } = newNavState;
		if (url.includes('/reauth')) {
			console.log('refresh url');
			const result = await handleActivateAccount();
			console.log('RESULT', result);
			setCurrentUrl(result!);
		} else if (url.includes('/return_url')) {
			//webViewRef.current?.stopLoading();
			const { accountId } = getParams(url);
			const result = await checkifAccountCanTakePayment(accountId);
			if (result?.success) {
				console.log('Navigate to success page');
				dispatch(autoSignInUser(user?.id!));
			} else {
				// @ts-ignore
				alert('Somethign went wrong while entering the information');
				return;
			}
			console.log(
				'check if account was created by retrieving the account and check for charges_enable = true'
			);
		} else if (url.includes('/login')) {
			console.log('retrieve account');
			webViewRef.current?.stopLoading();

			//const result = await handleActivateAccount();
			webViewRef.current.injectJavaScript(currentUrl);
		}
	};

	const checkifAccountCanTakePayment = async (accountId: string) => {
		try {
			const funRef = functions.httpsCallable('addConnectedAccountToUser');
			const { data } = await funRef({ accountId: accountId });
			const { success, result } = data as {
				success: boolean;
				result: string | boolean;
			};
			if (!success) {
				// @ts-ignore
				alert(result);
				return { success: success, result: result };
			} else {
				return { success, result };
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleActivateAccount = async () => {
		try {
			setProcessing(true);
			const funRef = functions.httpsCallable('createConnectedAccountForUser');
			const { data } = await funRef({
				businessName: user?.businessName,
				phone: user?.phone,
				address: user?.address,
				firsName: user?.firstName,
				lastName: user?.lastName,
			});
			console.log(data);
			const { success, result } = data as { success: boolean; result: string };

			if (success) {
				setCurrentUrl(result);
				setProcessing(false);
			}

			return result;
		} catch (error: any) {
			console.log(error.message);
			setCurrentUrl(null);
			setProcessing(false);
			//return navigation.pop();
		} finally {
			//setProcessing(false);
		}
	};

	const getParams = (url: string) => {
		let regexp = /[?&]([^=#]+)=([^&#]*)/g;
		let params: any = {};
		let check;
		while ((check = regexp.exec(url))) {
			params[check[1]] = check[2];
		}
		return params;
	};

	useEffect(() => {
		handleActivateAccount();
	}, []);

	if (processing) return <Loader />;
	return (
		<WebView
			style={{ flex: 1, marginTop: SIZES.statusBarHeight }}
			ref={webViewRef}
			originWhitelist={['*']}
			source={{ uri: currentUrl! }}
			onNavigationStateChange={handleNavigationChanges}
			sharedCookiesEnabled={true}
			// onShouldStartLoadWithRequest={(request) => {
			// 	if (request.url === currentUrl) return true;
			// 	setCurrentUrl(request.url);
			// 	return false;
			// }}
		></WebView>
	);
};

export default ConnectedAccountScreen;
