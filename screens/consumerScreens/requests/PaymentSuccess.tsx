import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CommonActions } from '@react-navigation/native';
import React, { FC } from 'react';
import { View } from 'react-native';
import { Screen, Text, Button } from '../../../components';
import { RequestTabParamList } from '../../../types';
import { useAppSelector } from '../../../redux/store';
import AnimatedLottieView from 'lottie-react-native';
import * as Animatable from 'react-native-animatable';

type Props = NativeStackScreenProps<RequestTabParamList, 'PaymentSuccess'>;

const PaymentSuccess: FC<Props> = ({ navigation }) => {
	const { logs } = useAppSelector((state) => state.logs);
	const theme = useAppSelector((state) => state.theme);

	const navigateBackToRequests = () => {
		navigation.dispatch(
			CommonActions.reset({
				index: 0,
				routes: [{ name: 'RequestScreen' }],
			})
		);
	};

	const totalPrice = () =>
		logs?.reduce((acc, curr) => acc + curr.cost!, 0).toFixed(2);
	return (
		<View style={{ flex: 1, backgroundColor: theme.BACKGROUND_COLOR }}>
			<AnimatedLottieView
				resizeMode='contain'
				source={require('../../../assets/animations/payment.json')}
				autoPlay
				duration={3000}
			>
				<Animatable.View
					animation='fadeInDown'
					style={{
						position: 'absolute',
						bottom: 20,
						left: 0,
						right: 0,
						justifyContent: 'center',
						alignItems: 'center',
					}}
					duration={500}
				>
					<Text bold duration={700} animation='fadeIn'>
						Thank you for your payment!
					</Text>
					<Text animation='fadeIn'>
						Your payment of ${totalPrice()} was received
					</Text>

					<Button
						style={{
							marginTop: 20,
							backgroundColor: theme.BACKGROUND_COLOR,
							borderColor: theme.PRIMARY_BUTTON_COLOR,
							borderWidth: 1,
						}}
						onPress={navigateBackToRequests}
					>
						<Text animation='fadeIn' duration={900} delay={600} bold>
							Got It!
						</Text>
					</Button>
				</Animatable.View>
			</AnimatedLottieView>
		</View>
	);
};

export default PaymentSuccess;
