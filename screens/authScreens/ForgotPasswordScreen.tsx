import React, { useState, FC, useEffect } from 'react';
import { View } from 'react-native';
import { Button, Header, InputField, Screen, Text } from '../../components';
import { SIZES } from '../../constants';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthTabParamList } from '../../types';
import { auth } from '../../firebase';
import { isEmailValid } from '../../utils/IsEmailValid';
type Props = NativeStackScreenProps<AuthTabParamList, 'ForgotPasswordScreen'>;

const ForgotPasswordScreen: FC<Props> = ({ route, navigation }) => {
	const [email, setEmail] = useState('');
	console.log('Email', route.params?.email);

	const sendEmailLink = async () => {
		try {
			if (isEmailValid(email)) {
				await auth.sendPasswordResetEmail(email + 'm');
				// @ts-ignore
				alert('Please check your email to reset your password');
				setEmail('');
				navigation.goBack();
			} else {
				// @ts-ignore
				alert('Invalid email');
			}
		} catch (error: any) {
			// @ts-ignore
			alert(error.message);
		}
	};
	useEffect(() => {
		if (route.params?.email) {
			setEmail(route.params.email);
		}
	}, [route.params?.email]);
	return (
		<Screen>
			<Header canGoBack />
			<View style={{ flex: 1, justifyContent: 'center', marginBottom: 20 }}>
				<View
					style={{
						width: SIZES.width,
					}}
				>
					<InputField
						placeholder='Email Address'
						keyboardType='email-address'
						value={email}
						onChangeText={(text) => setEmail(text.toLowerCase().trim())}
					/>
				</View>
				<Button
					onPress={sendEmailLink}
					style={{ width: '80%', alignSelf: 'center' }}
				>
					<Text center bold>
						Reset Password
					</Text>
				</Button>
			</View>
		</Screen>
	);
};

export default ForgotPasswordScreen;
