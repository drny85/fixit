import React, { FC, useEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import { Loader, Screen, Text, Header } from '../../../components';
import {
	useStripe,
	StripeProvider,
	PaymentSheetError,
	ConfirmPaymentSheetPaymentResult,
} from '@stripe/stripe-react-native';
import { useAppSelector } from '../../../redux/store';
import { db, functions } from '../../../firebase';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RequestTabParamList } from '../../../types';
import { useNetInfo } from '@react-native-community/netinfo';

type Props = NativeStackScreenProps<RequestTabParamList, 'PaymentScreen'>;

const PaymentScreen: FC<Props> = ({ route, navigation }) => {
	const { initPaymentSheet, presentPaymentSheet } = useStripe();
	const { user } = useAppSelector((state) => state.auth);
	const [proccessing, setProccessing] = useState<boolean>(true);
	const theme = useAppSelector((state) => state.theme);
	const { isConnected, isInternetReachable } = useNetInfo();

	const initializePaymentSheet = async () => {
		try {
			const functionRef = functions.httpsCallable('createPaymentIntent');
			setProccessing(true);
			const { data } = await functionRef({
				requestId: route.params.requestId,
			});

			if (!data.success) {
				alert('No data available');
				return;
			}
			const { customer, ephemeralKey, paymentIntent } = data.result;

			const { error } = await initPaymentSheet({
				customerId: customer,
				customerEphemeralKeySecret: ephemeralKey,
				paymentIntentClientSecret: paymentIntent,
			});

			if (error) {
				console.log('Error @', error);
			} else {
				setProccessing(false);
				openPaymentSheet();
			}
		} catch (error) {
			console.log('E', error);
		} finally {
			setProccessing(false);
		}
	};

	const openPaymentSheet = async () => {
		try {
			const { error } = await presentPaymentSheet({
				clientSecret: process.env.STRIPE_PUBLIC_KEY,
			});
			if (error) {
				Alert.alert(`${error.code}`, error.message);
				return;
			} else {
				console.log('Payment Success');
				navigation.replace('PaymentSuccess');
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if (isConnected && isInternetReachable) {
			initializePaymentSheet();
			//setProccessing(false);
		}
	}, [isConnected, isInternetReachable]);

	if (!process.env.STRIPE_PUBLIC_KEY || proccessing) return <Loader />;
	return (
		<StripeProvider
			publishableKey={process.env.STRIPE_PUBLIC_KEY!}
			threeDSecureParams={{
				timeout: 8,
				backgroundColor: theme.BACKGROUND_COLOR,
			}}
		>
			<View></View>
		</StripeProvider>
	);
};

export default PaymentScreen;
