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
import { functions } from '../../../firebase';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RequestTabParamList } from '../../../types';
import { useNetInfo } from '@react-native-community/netinfo';

type Props = NativeStackScreenProps<RequestTabParamList, 'PaymentScreen'>;

const PaymentScreen: FC<Props> = ({ route, navigation }) => {
	const { initPaymentSheet, presentPaymentSheet } = useStripe();
	const { user } = useAppSelector((state) => state.auth);
	const [proccessing, setProccessing] = useState<boolean>(false);
	const theme = useAppSelector((state) => state.theme);
	const { isConnected, isInternetReachable } = useNetInfo();

	const initializePaymentSheet = async () => {
		try {
			const functionRef = functions.httpsCallable('collectPayment');
			setProccessing(true);
			const {
				data: { customer, ephemeralKey, paymentIntent },
			} = await functionRef({
				requestId: route.params.requestId,
				userId: user?.id,
			});

			// setCustomerId(customer);

			// console.log(customer, paymentIntent, ephemeralKey);
			const { error } = await initPaymentSheet({
				customerId: customer,
				customerEphemeralKeySecret: ephemeralKey,
				paymentIntentClientSecret: paymentIntent,
			});

			if (error) {
				console.log('Error @', error);
			} else {
				openPaymentSheet();
			}
		} catch (error) {
			console.log(error);
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
				navigation.replace('PaymentSuccess');
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if (isConnected && isInternetReachable) {
			initializePaymentSheet();
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
			<Screen>
				<Header canGoBack title='Payment' />
				<Text>Payment Screen</Text>
			</Screen>
		</StripeProvider>
	);
};

export default PaymentScreen;
