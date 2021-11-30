import { Entypo } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, useEffect } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { Screen, Text, Header, Button } from '../../../components';
import { SIZES } from '../../../constants';
import { db } from '../../../firebase';
import { getLogsByRequestId } from '../../../redux/logsReducer/logsSlide';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { RequestTabParamList } from '../../../types';

type Props = NativeStackScreenProps<RequestTabParamList, 'PaymentBreakDown'>;

const PaymentBreakdown: FC<Props> = ({ route, navigation }) => {
	const { request } = route.params;
	const { logs } = useAppSelector((state) => state.logs);
	const theme = useAppSelector((state) => state.theme);
	const dispatch = useAppDispatch();
	const totalPrice = () =>
		logs?.reduce((acc, curr) => acc + curr.cost!, 0).toFixed(2);

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
	}, [request]);

	return (
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
					onPress={() =>
						navigation.navigate('PaymentScreen', { requestId: request?.id! })
					}
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
	);
};

export default PaymentBreakdown;

const PricesScrollViewContainer = styled.ScrollView``;
