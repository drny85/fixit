import React, { FC, useEffect, useState } from 'react';
import { Alert, TouchableOpacity, View } from 'react-native';
import {
	Button,
	Divider,
	GoogleAutoComplete,
	InputField,
	Screen,
	Text,
} from '../../components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styled from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { isEmailValid } from '../../utils/IsEmailValid';
import { AuthTabParamList } from '../../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { formatPhone } from '../../utils/formatPhone';
import { SIZES } from '../../constants';
import Layout from '../../constants/Layout';

import {
	GooglePlaceData,
	GooglePlaceDetail,
} from 'react-native-google-places-autocomplete';
import { Contractor } from '../../constants/Contractors';
import SkillsModalView from '../../components/SkillsModalView';
import { Service } from '../../constants/Services';
import { getServices } from '../../redux/servicesReducer/servicesActions';
import {
	setSelectedService,
	setServicesSelected,
} from '../../redux/servicesReducer/servicesSlide';

import {
	addContractor,
	isEmailAlreadyTaken,
} from '../../redux/contractorReducer/contractorsActions';
import { FlatList } from 'react-native-gesture-handler';
import { AntDesign, Feather } from '@expo/vector-icons';
import { auth } from '../../firebase';

type Props = NativeStackScreenProps<AuthTabParamList, 'SignUpAsContractor'>;

const SignUpAsContractor: FC<Props> = ({ navigation }) => {
	const [email, setEmail] = useState<string>('');
	const [phone, setPhone] = useState<string>('');
	const [firstName, setFirstName] = useState<string>('');
	const [lastName, setLastName] = useState<string>('');
	const [businessName, setBusinessName] = useState<string>('');
	const [bio, setBio] = useState<string>('');
	const [address, setAddress] = useState<string>('');
	const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
		null
	);
	const [firstNameError, setFirstNameError] = useState<string>('');
	const [lastNameError, setLastNameError] = useState<string>('');
	const { servicesSelected } = useAppSelector((state) => state.services);
	const theme = useAppSelector((state) => state.theme);
	const dispatch = useAppDispatch();
	const [emailError, setEmailError] = useState<string>('');
	const [businessNameError, setBusinessNameError] = useState<string>('');
	const [phoneError, setPhoneError] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [confirmPassword, setConfirmPassword] = useState<string>('');
	const [passwordError, setPasswordError] = useState('');
	const [passwordConfirmError, setPasswordConfirmError] = useState('');
	const [visible, setVisible] = useState<boolean>(false);
	const [showPassword, setShowPassword] = useState<boolean>(false);

	const getAddress = (data: GooglePlaceData, details: GooglePlaceDetail) => {
		setAddress(details.formatted_address);
		setCoords(details.geometry.location);
	};

	const calculateServices = (service: Service) => {
		const index = servicesSelected.findIndex((s) => s.id === service.id);

		if (index === -1) {
			dispatch(setServicesSelected([...servicesSelected, service]));
		} else {
			const newSkills = servicesSelected.filter((s) => s.id !== service.id);

			dispatch(setServicesSelected([...newSkills]));
		}
	};

	useEffect(() => {
		dispatch(getServices());
	}, [dispatch]);

	const handleSignUp = async () => {
		try {
			validateFirstName(firstName);
			validateLastName(lastName);
			validateBusinessName(businessName);
			validateAddress();
			validateJobs();

			validatePassword(password);
			validateConfirmPassword(confirmPassword);

			if (
				firstName.length < 3 ||
				lastName.length < 3 ||
				businessName.length < 5 ||
				address.length < 5 ||
				phone.length < 10 ||
				!isEmailValid(email) ||
				servicesSelected.length === 0 ||
				password.length < 6 ||
				password !== confirmPassword
			) {
				// @ts-ignore
				alert('Please check all fields');
				return false;
			}

			const userData: Contractor = {
				firstName,
				lastName,
				phone,
				email: email.toLowerCase().trim(),
				address,
				coords,
				businessName,
				bio,
				role: 'contractor',
				imageUrl: null,
				connectedAccountId: null,
				password,
				isActive: false,
				services: servicesSelected,
				addedOn: new Date().toISOString(),
			};

			const isTaken = await isEmailAlreadyTaken(userData.email);
			if (isTaken) {
				// @ts-ignore
				alert('Email is already taken');
				return;
			}

			const saved = await addContractor(userData);

			//dispatch(signup(userData));
			if (saved) {
				dispatch(setServicesSelected([]));
				navigation.replace('Success', { email, signupType: 'contractor' });
			}
		} catch (error: any) {
			Alert.alert('Error', error.message, [{ text: 'OK', style: 'cancel' }]);
			console.log(error);
		}
	};

	const validateFirstName = (value: string) => {
		if (value.length < 3) {
			setFirstNameError('Please enter your first name');

			return;
		} else {
			setFirstNameError('');
		}
	};
	const validateLastName = (value: string) => {
		if (value.length < 3) {
			setLastNameError('Please enter your last name');

			return;
		} else {
			setLastNameError('');
		}
	};
	const validateBusinessName = (value: string) => {
		if (value.length < 5) {
			setBusinessNameError(
				'Please enter a name for your business, more than 5 characters long'
			);

			return;
		} else {
			setBusinessNameError('');
		}
	};

	const validateAddress = () => {
		if (address.length < 5) {
			Alert.alert('No Addreess', 'Please enter a valid address', [
				{ text: 'OK', style: 'cancel' },
			]);

			return;
		}
	};

	const validateJobs = () => {
		if (servicesSelected.length === 0) {
			// Alert.alert('No Jobs', 'Please select at least a job you are good at.', [
			// 	{ text: 'OK', style: 'cancel' },
			// ]);
			// @ts-ignore
			alert('Please select at least a job you are good at.');
			//setCanContinue(false);
			return false;
		}
	};

	const validateEmail = (value: string) => {
		if (!isEmailValid(value)) {
			setEmailError('Invalid Email');

			return;
		} else {
			setEmailError('');
		}
	};

	const validatePassword = (value: string) => {
		if ((value.length < 6 && value.length > 2) || value === '') {
			setPasswordError('Password must be at least 6 characters');
			return;
		} else {
			setPasswordError('');
		}
	};
	const validateConfirmPassword = (value: string) => {
		if (
			(value.length < 6 && value.length > 3) ||
			value !== password ||
			value === ''
		) {
			setPasswordConfirmError('Passwords must match');
			return;
		} else {
			setPasswordConfirmError('');
		}
	};

	const validatePhone = (value: string) => {
		if (value.length < 10 && value.length > 5) {
			setPhoneError('Invalid phone');

			return;
		} else {
			setPhoneError('');
		}
	};

	const renderSkillView = (skills: Service[]) => {
		return (
			<SkillsView>
				<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
					{skills.length > 0 &&
						skills.map((s, index) => (
							<Skill
								// onPress={() => dispatch(setSelectedService(s))}
								style={{
									backgroundColor: '#ffffff',
									borderWidth: 1,

									borderColor: theme.ASCENT,
								}}
								key={index.toString()}
							>
								<Text darkText capitalize bold>
									{s.name}
								</Text>
							</Skill>
						))}
				</View>
			</SkillsView>
		);
	};

	return (
		<Screen>
			<FlatList
				ListHeaderComponent={
					<KeyboardAwareScrollView
						keyboardShouldPersistTaps='handled'
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
							<Text style={{ marginBottom: 15 }} center title>
								Sign Up As Contractor
							</Text>
							<InputField
								label='First Name'
								placeholder='John'
								autoCapitalize='words'
								onChangeText={(text) => {
									validateFirstName(text.trim());
									setFirstName(text.trim());
								}}
								value={firstName}
								rightIcon={
									firstName.length >= 3 ? (
										<AntDesign
											name='checkcircle'
											size={20}
											color={theme.PRIMARY_BUTTON_COLOR}
										/>
									) : undefined
								}
								errorMessage={firstNameError}
							/>
							<InputField
								label='Last Name'
								placeholder='Smith'
								autoCapitalize='words'
								onChangeText={(text) => {
									validateLastName(text.trim());
									setLastName(text.trim());
								}}
								value={lastName}
								rightIcon={
									lastName.length >= 3 ? (
										<AntDesign
											name='checkcircle'
											size={20}
											color={theme.PRIMARY_BUTTON_COLOR}
										/>
									) : undefined
								}
								errorMessage={lastNameError}
							/>
							<InputField
								label='Business Name'
								placeholder='Johns Repair'
								autoCapitalize='words'
								onChangeText={(text) => {
									validateBusinessName(text);
									setBusinessName(text);
								}}
								value={businessName}
								rightIcon={
									businessName.length >= 5 ? (
										<AntDesign
											name='checkcircle'
											size={20}
											color={theme.PRIMARY_BUTTON_COLOR}
										/>
									) : undefined
								}
								errorMessage={businessNameError}
							/>
							<GoogleAutoComplete
								label='Address'
								errorMessage={
									address.length < 10 && address.length > 5 ? (
										<Text>Invalid address</Text>
									) : null
								}
								onPress={(
									data: GooglePlaceData,
									details: GooglePlaceDetail
								) => {
									getAddress(data, details);
								}}
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
								rightIcon={
									phone.length >= 10 ? (
										<AntDesign
											name='checkcircle'
											size={20}
											color={theme.PRIMARY_BUTTON_COLOR}
										/>
									) : undefined
								}
								errorMessage={phoneError}
							/>
							<InputField
								label='Email'
								placeholder='john.smith@email.com'
								onChangeText={(text) => {
									validateEmail(text);
									setEmail(text.toLowerCase().trim());
								}}
								keyboardType='email-address'
								value={email}
								rightIcon={
									isEmailValid(email) ? (
										<AntDesign
											name='checkcircle'
											size={20}
											color={theme.PRIMARY_BUTTON_COLOR}
										/>
									) : undefined
								}
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
								value={password}
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
								value={confirmPassword}
								rightIcon={
									confirmPassword.length > 0 ? (
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
								errorMessage={passwordConfirmError}
							/>
							<Divider large />
							<View>
								<Text bold center>
									What type of jobs can you perform / fix?
								</Text>
								{renderSkillView(servicesSelected)}
								<Button
									onPress={() => setVisible(true)}
									style={{
										width: 'auto',
										alignSelf: 'center',
										backgroundColor: theme.PRIMARY_BUTTON_COLOR,
									}}
								>
									<Text bold lightText>
										{servicesSelected.length > 0
											? 'Add / Remove Jobs'
											: 'Add Jobs'}
									</Text>
								</Button>
							</View>
							<Divider large />

							<SubmitRequestButton onPress={handleSignUp}>
								<Text bold lightText>
									Sign Up
								</Text>
							</SubmitRequestButton>
							<View
								style={{
									marginBottom: 40,
									alignSelf: 'center',
									flexDirection: 'row',
									alignItems: 'center',
								}}
							>
								<Text>Sign up as consumer</Text>
								<SignUpButton
									onPress={() => navigation.replace('SignUpScreen')}
								>
									<Text>Sign Up</Text>
								</SignUpButton>
							</View>
						</AuthContainer>
						<SkillsModalView
							visible={visible}
							setVisible={setVisible}
							onPress={calculateServices}
						/>
					</KeyboardAwareScrollView>
				}
				data={[]}
				showsVerticalScrollIndicator={false}
				keyboardShouldPersistTaps='handled'
				keyExtractor={(item) => item.id}
				renderItem={() => {
					return <View></View>;
				}}
			/>
		</Screen>
	);
};

export default SignUpAsContractor;

const AuthContainer = styled.View`
	margin: 5px 20px;
	align-self: center;
	justify-content: center;
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

const SkillsView = styled.View`
	padding: 10px;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	flex-wrap: wrap;
`;

const Skill = styled.TouchableOpacity<{ center?: boolean }>`
	justify-content: center;
	align-items: center;
	max-width: 200px;
	margin: 5px;
	padding: 8px 15px;
	background-color: ${({ theme }) => theme.PRIMARY_BUTTON_COLOR};
	border-radius: 15px;
	${({ center }: any) => center && `align-self:center`}
`;
