import React, { FC, useState } from 'react';
import {
	Alert,
	TouchableHighlight,
	TouchableOpacity,
	View,
} from 'react-native';
import { InputField, Loader, Screen, Text } from '../../components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styled from 'styled-components/native';

import { useAppDispatch, useAppSelector } from '../../redux/store';
import { isEmailValid } from '../../utils/IsEmailValid';
import { autoSignInUser } from '../../redux/authReducer/authActions';

import { AuthTabParamList } from '../../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { auth, db } from '../../firebase';
import { SIZES } from '../../constants';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import Layout from '../../constants/Layout';
import { setUserRole } from '../../redux/authReducer/authSlider';
import { Contractor } from '../../constants/Contractors';

type Props = NativeStackScreenProps<AuthTabParamList, 'LoginScreen'>;

const LoginScreen: FC<Props> = ({ navigation }) => {
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const theme = useAppSelector((state) => state.theme);
	const dispatch = useAppDispatch();
	const [emailError, setEmailError] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

	const validateEmail = (value: string) => {
		if (!isEmailValid(value) && value.length > 0) {
			setEmailError('Invalid Email');
		} else {
			setEmailError('');
		}
	};
	const validatePassword = (value: string) => {
		if (value.length < 6 && value.length > 0) {
			setPasswordError('Password must be at least 6 characters');
		} else {
			setPasswordError('');
		}
	};

	const handleLogin = async () => {
		try {
			if (email === '' || password === '') {
				Alert.alert('Error', 'Both Fields Required', [
					{ text: 'OK', style: 'cancel' },
				]);
				return;
			}
			setLoading(true);
			const { user } = await auth.signInWithEmailAndPassword(email, password);
			if (!user?.emailVerified) {
				console.log(user);
				Alert.alert(
					'Email not Verified',
					'You must verify your email first. \n Please check your email',
					[
						{ text: 'Ok', style: 'cancel' },
						{
							text: 'Resend Link',
							onPress: () => user?.sendEmailVerification(),
						},
					]
				);
				setLoading(false);
				return;
			} else {
				if (user) {
					const results = await user.getIdTokenResult();
					const role = results.claims.role;
					const res = await db.collection('users').doc(user.uid).get();
					if (
						(res.data() as any).role === 'contractor' &&
						role === 'consumer'
					) {
						Alert.alert(
							'Account not active',
							'Your account must verify and approved.',
							[
								{
									text: 'Cancel',
									style: 'cancel',
									onPress: () => {
										return;
									},
								},
								{
									text: 'Check Status',
									onPress: () =>
										navigation.navigate('SignupStatus', {
											contractor: { id: res.id, ...res.data() } as Contractor,
										}),
								},
							]
						);
						setLoading(false);
						return;
					} else {
						dispatch(setUserRole(role));
						dispatch(autoSignInUser(user.uid));
					}
				}
			}
		} catch (error: any) {
			console.log(error.message);
			setLoading(false);
			Alert.alert('Error', error.message, [{ text: 'OK', style: 'cancel' }]);
		}
	};

	if (loading) return <Loader />;
	return (
		<Screen>
			<KeyboardAwareScrollView
				keyboardDismissMode='on-drag'
				contentContainerStyle={{ flex: 1 }}
			>
				<AuthContainer
					style={{
						flex: 1,
						width: SIZES.width,
						maxWidth: !Layout.isSmallDevice ? SIZES.width * 0.7 : SIZES.width,
					}}
				>
					<Text tange center xlarge>
						Sign In
					</Text>
					<InputField
						label='Email'
						placeholder='Type your email'
						onChangeText={(text) => {
							validateEmail(text);
							setEmail(text);
						}}
						keyboardType='email-address'
						value={email}
						errorMessage={emailError}
						leftIcon={
							<MaterialIcons
								name='email'
								size={20}
								color={theme.mode === 'dark' ? '#ffffff' : '#212121'}
							/>
						}
					/>
					<InputField
						label='Password'
						placeholder='Type your password'
						secureTextEntry={!showPassword}
						onChangeText={(text) => {
							validatePassword(text.trim());
							setPassword(text.trim());
						}}
						value={password}
						errorMessage={passwordError}
						rightIcon={
							password.length > 0 ? (
								<TouchableOpacity
									onPress={() => setShowPassword(!showPassword)}
								>
									<Feather
										name={showPassword ? 'eye-off' : 'eye'}
										size={24}
										color={theme.mode === 'dark' ? '#ffffff' : '#212121'}
									/>
								</TouchableOpacity>
							) : undefined
						}
						leftIcon={
							<MaterialIcons
								name='lock'
								size={20}
								color={theme.mode === 'dark' ? '#ffffff' : '#212121'}
							/>
						}
					/>
					<TouchableHighlight
						style={{ marginBottom: 5 }}
						activeOpacity={0}
						underlayColor={theme.BACKGROUND_COLOR}
						onPress={() =>
							navigation.navigate('ForgotPasswordScreen', { email: email })
						}
					>
						<Text caption right>
							Forgot Password?
						</Text>
					</TouchableHighlight>

					<SubmitRequestButton onPress={handleLogin}>
						<Text title>Login</Text>
					</SubmitRequestButton>
				</AuthContainer>
				<View
					style={{
						marginBottom: 20,
						alignSelf: 'center',
						flexDirection: 'row',
						alignItems: 'center',
					}}
				>
					<Text>Do not have an account?</Text>
					<SignUpButton onPress={() => navigation.replace('SignUpScreen')}>
						<Text>Sign Up</Text>
					</SignUpButton>
				</View>
			</KeyboardAwareScrollView>
		</Screen>
	);
};

export default LoginScreen;

const AuthContainer = styled.View`
	width: 95%;
	align-self: center;
	margin: 5px 20px;
	justify-content: center;
	height: 100%;
`;

const SubmitRequestButton = styled.TouchableOpacity`
	background-color: ${({ theme }) => theme.PRIMARY_BUTTON_COLOR};
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
