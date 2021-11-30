import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CommonActions } from '@react-navigation/native';
import React, { FC } from 'react';
import { View } from 'react-native';
import { Screen, Text, Button } from '../../../components';
import { RequestTabParamList } from '../../../types';

type Props = NativeStackScreenProps<RequestTabParamList, 'PaymentSuccess'>;

const PaymentSuccess: FC<Props> = ({ navigation }) => {
	return (
		<Screen center>
			<Text>Payment success</Text>

			<Button onPress={() => navigation.replace('Home')}>
				<Text>Got It!</Text>
			</Button>
		</Screen>
	);
};

export default PaymentSuccess;
