import { Entypo } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, ListRenderItem, View } from 'react-native';
import styled from 'styled-components/native';
import { Screen, Text, Header, Button, Loader } from '../../../components';
import { SIZES } from '../../../constants';
import { useStripe, StripeProvider } from '@stripe/stripe-react-native';
import { db, functions } from '../../../firebase';
import { getLogsByRequestId } from '../../../redux/logsReducer/logsSlide';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { Log, RequestTabParamList } from '../../../types';
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
		} catch (error: any) {
			console.log('E', error.details.message);
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

	const renderPriceItems: ListRenderItem<Log> = ({ item }) => {
		return (
			<Price key={item.id}>
				<Text>{item.body}</Text>
				<Text>${item.cost}</Text>
			</Price>
		);
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
					<FlatList
						ListFooterComponent={() => (
							<View style={{ padding: SIZES.padding * 0.5 }}>
								<Text caption>
									Service Fee:${' '}
									{logs.filter((l) =>
										l.body === 'service fee' ? l.body === 'service fee' : false
									).length > 0
										? logs.filter((l) => l.body === 'service fee')[0].body
										: 0}
								</Text>
							</View>
						)}
						data={logs.filter((l) => l.cost! > 0 && l.body !== 'service fee')}
						keyExtractor={(item) => item.id!}
						renderItem={renderPriceItems}
					/>
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

const Price = styled.View`
	align-items: center;
	justify-content: space-between;
	background-color: ${({ theme }) => theme.SHADOW_COLOR};
	flex-direction: row;
	margin: 5px 10px;
	padding: 10px;
	border-radius: 10px;
`;
