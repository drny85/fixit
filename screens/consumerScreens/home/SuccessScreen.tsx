import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AnimatedLottieView from 'lottie-react-native';
import React, { FC } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { Divider, Screen, Text } from '../../../components';
import { SIZES } from '../../../constants';
import { HomeTabParamList } from '../../../types';

type Props = NativeStackScreenProps<HomeTabParamList, 'SuccessScreen'>;

const SuccessScreen: FC<Props> = ({ navigation, route }) => {
	return (
		<Screen>
			<View
				style={{
					flex: 1,
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<AnimatedLottieView
					style={{
						justifyContent: 'center',
						alignItems: 'center',
						height: SIZES.height * 0.2,
					}}
					source={require('../../../assets/animations/welldone.json')}
					autoPlay
					resizeMode='center'
				/>
			</View>
			<View
				style={{
					position: 'absolute',
					top: SIZES.height * 0.2,
					padding: SIZES.padding,
					left: 0,
					right: 0,
				}}
			>
				<Text bold center large>
					Thank you for your request!
				</Text>
				<View>
					<Text caption style={{ lineHeight: 24 }}>
						Please note that you request is in pending status. It has not been
						confirmed. Someone will get in touch with you shortly or depending
						on the day of your request. We will make everything possible to
						serve you.
					</Text>
					<Divider />
					<Text tange style={{ fontSize: 40, marginTop: SIZES.padding }}>
						Thanks again for doing business with us!
					</Text>
				</View>
			</View>
			<View
				style={{
					position: 'absolute',
					bottom: 0,
					left: 0,
					right: 0,
					alignSelf: 'center',
					zIndex: 99,
				}}
			>
				<SubmitRequestButton
					onPress={() => {
						//setSuccess(false);
						navigation.replace('Home');
					}}
				>
					<Text title>Got it!</Text>
				</SubmitRequestButton>
			</View>
		</Screen>
	);
};

export default SuccessScreen;

const SubmitRequestButton = styled.TouchableOpacity`
	background-color: ${({ theme }) => theme.ASCENT};
	padding: 15px 30px;
	justify-content: center;

	align-items: center;
	align-self: center;
	width: 60%;
	border-radius: 15px;
	margin: 15px 2px;
`;
