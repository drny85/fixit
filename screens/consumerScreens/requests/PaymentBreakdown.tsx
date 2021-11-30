import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import { View } from 'react-native';
import { Screen, Text } from '../../../components';
import { RequestTabParamList } from '../../../types';

type Props = NativeStackScreenProps<RequestTabParamList, 'PaymentBreakDown'>;

const PaymentBreakdown: FC<Props> = ({ route }) => {
	const { request } = route.params;

	const totalPrice = () =>
		request?.logs?.reduce((acc, curr) => acc + curr.cost!, 0);

	console.log('TP', totalPrice());
	return (
		<Screen center>
			<Text>Payment Brekdown {totalPrice()}</Text>
		</Screen>
	);
};

export default PaymentBreakdown;
