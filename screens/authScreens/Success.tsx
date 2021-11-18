import React, { FC } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AnimatedLottieView from 'lottie-react-native';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { Divider, Screen, Text } from '../../components';
import { AuthTabParamList } from '../../types';

type Props = NativeStackScreenProps<AuthTabParamList, 'Success'>;
const Success: FC<Props> = ({ navigation, route }) => {
	const { signupType } = route.params;

	console.log(signupType);
	return (
		<Screen style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<AnimatedLottieView
				style={{ flex: 1 }}
				resizeMode='contain'
				autoPlay
				source={require('../../assets/animations/success.json')}
			/>

			<View>
				<Text title center>
					Thanks for signing up!
				</Text>
				<Divider />
				<Text style={{ lineHeight: 40, paddingHorizontal: 20 }} large center>
					Please check your {route.params.email} email to verify it.
				</Text>
			</View>

			<SuccessButton onPress={() => navigation.replace('LoginScreen')}>
				<Text title>Got it!</Text>
			</SuccessButton>
		</Screen>
	);
};

export default Success;

const SuccessButton = styled.TouchableOpacity`
	background-color: ${({ theme }) => theme.SECONDARY_BUTTON_COLOR};
	padding: 15px 30px;
	justify-content: center;
	align-items: center;
	position: absolute;
	bottom: 50px;
	z-index: 100;
	align-self: center;
	width: 60%;
	border-radius: 15px;
	margin: 15px 2px;
`;
