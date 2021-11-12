import React, { FC, useState } from 'react';
import { Alert, TouchableOpacity, View } from 'react-native';
import { InputField, Screen, Text } from '../../components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styled from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { isEmailValid } from '../../utils/IsEmailValid';
import {
	signup,
	singupUser,
	UserData,
} from '../../redux/authReducer/authActions';
import { AuthTabParamList } from '../../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { formatPhone } from '../../utils/formatPhone';
import { SIZES } from '../../constants';
import Layout from '../../constants/Layout';
import { Feather } from '@expo/vector-icons';

type Props = NativeStackScreenProps<AuthTabParamList, 'SignUpScreen'>;

const SignUpScreen: FC<Props> = ({ navigation }) => {
	const [email, setEmail] = useState<string>('');
	const [phone, setPhone] = useState<string>('');
	const [name, setName] = useState<string>('');
	const [nameError, setNameError] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [confirmPassword, setConfirmPassword] = useState<string>('');
	const theme = useAppSelector((state) => state.theme);
	const dispatch = useAppDispatch();
	const [emailError, setEmailError] = useState('');
	const [phoneError, setPhoneError] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [passwordConfirmError, setPasswordConfirmError] = useState('');
	const [canContinue, setCanContinue] = useState<boolean>(false);
	const { error } = useAppSelector((state) => state.auth);

	const handleSignUp = async () => {
		try {
			const userData: UserData = {
				name,
				phone,
				email,
				password,
				role: 'consumer',
				imageUrl: null,
				isActive: true,
				services: [],
				addedOn: new Date().toISOString(),
			};
			if (!canContinue) {
				Alert.alert('Error', 'All fields are required', [
					{ text: 'OK', style: 'cancel' },
				]);
				return;
			}

			if (
				name.length < 5 ||
				name.trimEnd().split(' ').length < 2 ||
				phone.length < 10 ||
				!isEmailValid(email) ||
				password.length < 6 ||
				password !== confirmPassword
			) {
				Alert.alert('Error', 'All fields are required', [
					{ text: 'OK', style: 'cancel' },
				]);
				return;
			}

			const success = await singupUser(userData);
			console.log('SUCESS', success);
			if (success) {
				navigation.replace('Success', { email, signupType: 'consumer' });
			} else {
				console.log('SSSS', success);
			}
		} catch (error: any) {
			Alert.alert('Error', error.message, [{ text: 'OK', style: 'cancel' }]);
			console.log(error);
		}
	};

	const validateName = (value: string) => {
		if (
			(value.length < 5 && value.length > 2) ||
			value.trimEnd().split(' ').length < 2
		) {
			setNameError('Please enter your full name');
		} else {
			setNameError('');
		}
	};

	const validateEmail = (value: string) => {
		if (!isEmailValid(value)) {
			setEmailError('Invalid Email');
			setCanContinue(false);
		} else {
			setEmailError('');
			setCanContinue(true);
		}
	};
	const validatePassword = (value: string) => {
		if (value.length < 6) {
			setPasswordError('Password must be at least 6 characters');
			setCanContinue(false);
		} else {
			setPasswordError('');
			setCanContinue(true);
		}
	};
	const validateConfirmPassword = (value: string) => {
		if ((value.length < 6 && value.length > 3) || value !== password) {
			setPasswordConfirmError('Passwords must match');
			setCanContinue(false);
		} else {
			setPasswordConfirmError('');
			setCanContinue(true);
		}
	};
	const validatePhone = (value: string) => {
		if (value.length < 10 && value.length > 5) {
			setPhoneError('Invalid phone');
			setCanContinue(false);
		} else {
			setPhoneError('');
			setCanContinue(true);
		}
	};

	return (
		<Screen>
			<KeyboardAwareScrollView
				keyboardDismissMode='on-drag'
				contentContainerStyle={{ flex: 1, width: '100%' }}
			>
				<AuthContainer
					style={{
						flex: 1,
						width: SIZES.width,
						maxWidth: Layout.isSmallDevice
							? SIZES.width * 1
							: SIZES.width * 0.7,
					}}
				>
					<Text center title>
						Sign Up
					</Text>
					<InputField
						label='Full Name'
						placeholder='John Smith'
						autoCapitalize='words'
						onChangeText={(text) => {
							validateName(text);
							setName(text);
						}}
						value={name}
						errorMessage={nameError}
					/>
					<InputField
						label='Phone'
						placeholder='(987)-654-3210'
						maxLenght={14}
						onChangeText={(text) => {
							validatePhone(text);
							setPhone(formatPhone(text));
						}}
						keyboardType='numeric'
						value={phone}
						errorMessage={phoneError}
					/>
					<InputField
						label='Email'
						placeholder='john.smith@email.com'
						onChangeText={(text) => {
							validateEmail(text);
							setEmail(text);
						}}
						keyboardType='email-address'
						value={email}
						errorMessage={emailError}
					/>
					<InputField
						label='Password'
						placeholder='Type your password'
						secureTextEntry={!showPassword}
						onChangeText={(text) => {
							validatePassword(text.trim());
							setPassword(text.trim());
						}}
						rightIcon={
							<TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
								<Feather
									name={showPassword ? 'eye-off' : 'eye'}
									size={24}
									color={theme.mode === 'dark' ? '#ffffff' : '#212121'}
								/>
							</TouchableOpacity>
						}
						value={password}
						errorMessage={passwordError}
					/>
					<InputField
						label='Confirm Password'
						placeholder='Confirm your password'
						secureTextEntry={!showPassword}
						onChangeText={(text) => {
							validateConfirmPassword(text.trim());
							setConfirmPassword(text.trim());
						}}
						rightIcon={
							<TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
								<Feather
									name={showPassword ? 'eye-off' : 'eye'}
									size={24}
									color={theme.mode === 'dark' ? '#ffffff' : '#212121'}
								/>
							</TouchableOpacity>
						}
						value={confirmPassword}
						errorMessage={passwordConfirmError}
					/>
					<SubmitRequestButton onPress={handleSignUp}>
						<Text bold>Sign Up</Text>
					</SubmitRequestButton>
				</AuthContainer>
				<View
					style={{
						marginBottom: 20,
						alignSelf: 'center',

						alignItems: 'center',
					}}
				>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center',
						}}
					>
						<Text>Have an account?</Text>
						<SignUpButton onPress={() => navigation.replace('LoginScreen')}>
							<Text>Log In</Text>
						</SignUpButton>
					</View>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center',
						}}
					>
						<Text>Sign Up as Contractor</Text>
						<SignUpButton
							onPress={() => navigation.replace('SignUpAsContractor')}
						>
							<Text>Sign Up</Text>
						</SignUpButton>
					</View>
				</View>
			</KeyboardAwareScrollView>
		</Screen>
	);
};

export default SignUpScreen;

const AuthContainer = styled.View`
	margin: 5px 20px;
	align-self: center;
	justify-content: center;
`;

const SubmitRequestButton = styled.TouchableOpacity`
	background-color: ${({ theme }) => theme.SECONDARY_BUTTON_COLOR};
	padding: 15px 30px;
	justify-content: center;
	align-items: center;
	align-self: center;
	width: 60%;
	border-radius: 15px;
	margin: 15px 2px;
`;

const SignUpButton = styled.TouchableOpacity`
	padding: 10px;
`;
function alert(arg0: string) {
	throw new Error('Function not implemented.');
}
