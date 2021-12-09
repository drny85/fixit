import { Entypo } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import styled from 'styled-components/native';
import { Screen, Text, Header, Button, Loader } from '../../../components';
import { SIZES } from '../../../constants';
import { useStripe, StripeProvider } from '@stripe/stripe-react-native';
import { db, functions } from '../../../firebase';
import { getLogsByRequestId } from '../../../redux/logsReducer/logsSlide';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { RequestTabParamList } from '../../../types';
import { useNetInfo } from '@react-native-community/netinfo';

type Props = NativeStackScreenProps<RequestTabParamList, 'PaymentBreakDown'>;

const PaymentBreakdown: FC<Props> = ({ route, navigation }) => {
	const { request } = route.params;
	const { initPaymentSheet, presentPaymentSheet } = useStripe();
	const { isConnected, isInternetReachable } = useNetInfo();
	const { logs } = useAppSelector((state) => state.logs);
	const [proccessing, setProccessing] = useState<boolean>(false);
	const theme = useAppSelector((state) => state.theme);
	const dispatch = useAppDispatch();
	const totalPrice = () =>
		logs?.reduce((acc, curr) => acc + curr.cost!, 0).toFixed(2);

	const initializePaymentSheet = useCallback(async () => {
		try {
			if (isConnected && isInternetReachable) {
				const functionRef = functions.httpsCallable('createPaymentIntent');
				setProccessing(true);
				const { data } = await functionRef({
					requestId: request?.id,
					contractorId: request?.contractor?.id,
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
			} else {
				alert('Internet connection issues');
				return;
			}
		} catch (error) {
			console.log('E', error);
		} finally {
			setProccessing(false);
		}
	}, [isInternetReachable]);

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
		const logsSub = db
			.collection('logs')
			.doc(request?.id)
			.collection('logs')
			.onSnapshot((snap) => {
				dispatch(
					getLogsByRequestId(
						snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
					)
				);
			});

		return logsSub;
	}, [request, isInternetReachable]);

	if (proccessing) return <Loader />;

	return (
		<StripeProvider
			publishableKey={process.env.STRIPE_PUBLIC_KEY!}
			threeDSecureParams={{
				timeout: 8,
				backgroundColor: theme.BACKGROUND_COLOR,
			}}
		>
			<Screen>
				<Header title='Total BreakDown' canGoBack />
				<View style={{ flex: 1 }}>
					<PricesScrollViewContainer>
						{logs.length > 0 &&
							logs.map((log) => {
								return (
									log.cost! > 0 && (
										<View
											style={{
												justifyContent: 'space-between',
												alignItems: 'center',
												flexDirection: 'row',
												margin: 5,
												borderRadius: SIZES.radius,
												padding: SIZES.padding * 0.5,
												backgroundColor: theme.ASCENT,
											}}
											key={log.id}
										>
											<Text bold capitalize>
												{log.body}
											</Text>
											<Text bold>${log.cost}</Text>
										</View>
									)
								);
							})}
					</PricesScrollViewContainer>
				</View>
				<View
					style={{
						position: 'absolute',
						bottom: 10,
						alignSelf: 'center',
					}}
				>
					<Button
						disabled={proccessing}
						style={{
							backgroundColor: proccessing
								? theme.ASCENT
								: theme.PRIMARY_BUTTON_COLOR,
						}}
						onPress={initializePaymentSheet}
					>
						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'center',
								alignItems: 'center',
							}}
						>
							<Entypo
								name='credit-card'
								size={24}
								style={{ marginRight: 8 }}
								color={theme.mode === 'dark' ? '#ffffff' : '#212121'}
							/>
							<Text bold>Pay ${totalPrice()}</Text>
						</View>
					</Button>
				</View>
			</Screen>
		</StripeProvider>
	);
};

export default PaymentBreakdown;

const PricesScrollViewContainer = styled.ScrollView``;
