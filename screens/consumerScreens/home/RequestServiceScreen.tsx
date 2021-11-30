import { FontAwesome } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, useState, useRef } from 'react';
import {
	ScrollView,
	TouchableOpacity,
	View,
	Platform,
	TouchableHighlight,
	Modal,
	Alert,
	ImageBackground,
} from 'react-native';
import styled from 'styled-components/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
	Divider,
	GoogleAutoComplete,
	HoursPickerModal,
	InputField,
	Screen,
	Text,
} from '../../../components';
import { COLORS, FONTS, SIZES } from '../../../constants';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
	setContactmethod,
	setSelectedService,
} from '../../../redux/servicesReducer/servicesSlide';
import { useAppDispatch, useAppSelector } from '../../../redux/store';

import { HomeTabParamList } from '../../../types';
import moment from 'moment';
import Layout, { statusBarHeight } from '../../../constants/Layout';
import {
	addRequest,
	Request,
} from '../../../redux/requestReducer/requestActions';
import { useImages } from '../../../hooks/useImages';
import ImagesContainer from '../../../components/ImagesContainer';
import {
	GooglePlaceData,
	GooglePlaceDetail,
} from 'react-native-google-places-autocomplete';

type Props = NativeStackScreenProps<HomeTabParamList, 'RequestServiceScreen'>;

const RequestServiceScreen: FC<Props> = ({ route, navigation }) => {
	const { images, pickImages } = useImages();
	const inputRef = useRef<any>();
	const scrollRef = useRef<any>();
	const [selectedImage, setSelectedImage] = useState<string>('');
	const [viewImage, setViewImage] = useState(false);
	const [apt, setApt] = useState<string | null>(null);
	const [hoursPicker, setHoursPicker] = useState(false);
	const [pickAddress, setPickAddress] = useState(false);
	const [selectedHours, setSelectedHours] = useState<string>('');
	const [address, setAddress] = useState<string>('');
	const { selectedService, contactMethod } = useAppSelector(
		(state) => state.services
	);
	const { selectedContractor } = useAppSelector((state) => state.contractors);
	const { user } = useAppSelector((state) => state.auth);
	const theme = useAppSelector((state) => state.theme);
	const dispatch = useAppDispatch();
	const [description, setDescription] = useState('');
	const [show, setShow] = useState<boolean>(false);
	const [showReview, setShowReview] = useState<boolean>(false);
	const [serviceDate, setServiceDate] = useState(new Date());

	const onChange = (_: any, selectedDate: any) => {
		const currentDate = selectedDate;
		setShow(Platform.OS === 'ios');
		if (selectedDate) {
			setServiceDate(currentDate);
		}
	};

	const renderAddressModal = () => {
		return (
			<Modal transparent animationType='slide' visible={pickAddress}>
				<Overlay>
					<View
						style={{
							backgroundColor: theme.SECONDARY_BUTTON_COLOR,
							position: 'absolute',
							left: 0,
							right: 0,
							height: SIZES.height * 0.7,
							bottom: 0,
							borderTopLeftRadius: SIZES.radius * 3,
							borderTopRightRadius: SIZES.radius * 3,
						}}
					>
						<View
							style={{
								flexDirection: 'row',
								paddingVertical: SIZES.padding,
								justifyContent: 'space-between',
								marginHorizontal: SIZES.padding * 2,
							}}
						>
							<TouchableHighlight
								activeOpacity={0}
								underlayColor={COLORS.light}
								onPress={() => setPickAddress(false)}
							>
								<Text style={{ ...FONTS.body3, color: COLORS.red }}>
									Cancel
								</Text>
							</TouchableHighlight>
							<TouchableHighlight
								underlayColor={theme.SECONDARY_BUTTON_COLOR}
								onPress={() => setPickAddress(false)}
							>
								<Text
									style={{
										...FONTS.h3,
										color: theme.mode === 'dark' ? '#ffffff' : '#212121',
									}}
								>
									Done
								</Text>
							</TouchableHighlight>
						</View>
						<View
							style={{
								flex: 1,
								marginTop: 20,

								width: '100%',
								backgroundColor: theme.BACKGROUND_COLOR,
							}}
						>
							<GoogleAutoComplete
								label='Service Address'
								onPress={(
									data: GooglePlaceData,
									details: GooglePlaceDetail
								) => {
									const { formatted_address } = details;
									setAddress(
										formatted_address.substring(0, formatted_address.length - 5)
									);
								}}
							/>
							{address !== '' && (
								<InputField
									placeholder='Apt, Unit, Suite'
									value={apt!}
									onChangeText={(text) => setApt(text.toUpperCase())}
								/>
							)}
						</View>
					</View>
				</Overlay>
			</Modal>
		);
	};

	const handleAddRequest = async () => {
		try {
			const request: Request = {
				userId: user?.id!,
				description,
				serviceDate: serviceDate.toISOString(),
				receivedOn: new Date().toISOString(),
				service: selectedService,
				serviceTime: selectedHours,
				contactMethod: contactMethod,
				customer: user || undefined,
				contractor: selectedContractor || undefined,
				status: 'pending',
				images: images,
				apt: apt!,
				serviceAddress: address,
			};

			const saved = await dispatch(addRequest(request));

			if (saved) {
				setShowReview(false);
				navigation.navigate('SuccessScreen');
			} else return;
		} catch (error) {
			console.log(error);
		}
	};

	const renderReviewOfRequestModal = (showIt: boolean) => {
		if (showIt) {
			return (
				<Modal animationType='slide' visible={showReview}>
					<ScrollView
						style={{ flex: 1 }}
						contentContainerStyle={{
							flex: 1,
						}}
					>
						<View
							style={{
								flex: 1,
								borderRadius: 35,
								justifyContent: 'space-between',
								marginTop: statusBarHeight,
								padding: 20,
								backgroundColor: theme.BACKGROUND_COLOR,
							}}
						>
							<View>
								<TouchableOpacity
									style={{
										height: 40,
										width: 40,
										justifyContent: 'center',
										alignItems: 'center',
										borderRadius: 20,
										marginBottom: 20,
										backgroundColor: theme.ASCENT,
									}}
									onPress={() => setShowReview(false)}
								>
									<FontAwesome name='close' size={20} />
								</TouchableOpacity>

								<View>
									<Text style={{ ...FONTS.body4 }}>
										You are requesting services from {selectedContractor?.name}
									</Text>
									<Text style={{ ...FONTS.body4 }}>
										The type of job you are requesting is for{' '}
										{selectedService!.name!.toUpperCase()} and you want this
										service to start on {moment(serviceDate).format('ll')}{' '}
										between {selectedHours}
									</Text>
									<Text style={{ ...FONTS.body4 }}>
										Your preferred method of contact is by {contactMethod}
									</Text>
									<Text style={{ ...FONTS.body4 }}>
										The service address is {address}{' '}
										{apt && `and apt/unit # is ${apt}`}
									</Text>
									{images.length > 0 ? (
										<>
											<Divider style={{ marginTop: 20 }} large />
											<Text style={{ marginBottom: 20 }} center bold>
												You have provided these images
											</Text>
											<ImagesContainer
												images={images}
												viewImage={viewImage}
												setSelectedImage={setSelectedImage}
												setViewImage={setViewImage}
												selectedImage={selectedImage}
											/>
										</>
									) : (
										<>
											<Divider style={{ marginTop: 20 }} large />
											<Text center bold>
												You did not provide any images/photos
											</Text>
										</>
									)}
									<Divider large />
									<Text bold>This is the description you provided</Text>
									<Text style={{ fontSize: 18 }} caption>
										{description}
									</Text>
								</View>
							</View>
							<SubmitRequestButton
								onPress={handleAddRequest}
								style={{ marginBottom: 50, flexDirection: 'row' }}
							>
								<Text title>Look Good!</Text>
								<FontAwesome
									name='thumbs-o-up'
									style={{ marginLeft: 10 }}
									size={24}
								/>
							</SubmitRequestButton>
							<View style={{ marginBottom: 20 }} />
						</View>
					</ScrollView>
				</Modal>
			);
		}
	};

	const renderDateTimeModal = (SIZES: any) => {
		if (Platform.OS === 'ios' && show) {
			return (
				<Modal transparent animationType='slide' visible={show}>
					<View
						style={{
							backgroundColor: theme.SECONDARY_BUTTON_COLOR,
							position: 'absolute',
							left: 0,
							right: 0,
							height: SIZES.height * 0.7,
							bottom: 0,
							borderTopLeftRadius: SIZES.radius * 3,
							borderTopRightRadius: SIZES.radius * 3,
						}}
					>
						<View
							style={{
								flexDirection: 'row',
								paddingVertical: SIZES.padding,
								justifyContent: 'space-between',
								marginHorizontal: SIZES.padding * 2,
							}}
						>
							<TouchableHighlight
								activeOpacity={0}
								underlayColor={COLORS.light}
								onPress={() => setShow(false)}
							>
								<Text style={{ ...FONTS.body3, color: COLORS.red }}>
									Cancel
								</Text>
							</TouchableHighlight>
							<TouchableHighlight
								underlayColor={theme.SECONDARY_BUTTON_COLOR}
								onPress={() => setShow(false)}
							>
								<Text style={{ ...FONTS.h3, color: 'blue' }}>Done</Text>
							</TouchableHighlight>
						</View>
						<View
							style={{
								flex: 1,
								marginBottom: 20,
								justifyContent: 'center',
								alignItems: 'center',
								backgroundColor: theme.BACKGROUND_COLOR,
							}}
						>
							<DateTimePicker
								style={{
									width: '90%',
									alignSelf: 'center',
									height: '90%',
								}}
								testID='dateTimePicker'
								value={serviceDate}
								minimumDate={new Date(moment().format('YYYY-MM-DD'))}
								maximumDate={
									new Date(moment().add(3, 'months').format('YYYY-MM-DD'))
								}
								mode={'date'}
								display={Platform.OS === 'ios' ? 'inline' : 'default'}
								onChange={onChange}
							/>
						</View>
					</View>
				</Modal>
			);
		}
	};

	return (
		<Screen>
			<KeyboardAwareScrollView
				ref={scrollRef}
				contentContainerStyle={{
					justifyContent: 'center',
					width: SIZES.isSmallDevice ? SIZES.width : SIZES.width * 0.6,
					alignSelf: 'center',
				}}
				keyboardDismissMode='on-drag'
			>
				<Header>
					<TouchableOpacity onPress={() => navigation.goBack()}>
						<FontAwesome
							name='chevron-left'
							size={24}
							color={theme.mode === 'dark' ? '#ffffff' : '#212121'}
						/>
					</TouchableOpacity>
					<Text capitalize center bold medium>
						services from {selectedContractor && selectedContractor.name}
					</Text>
					<Text></Text>
				</Header>
				<Divider large />
				<View>
					<Text bold center>
						Job Selected
					</Text>
					<Skill style={{ backgroundColor: theme.ASCENT }} center>
						<Text capitalize bold>
							{selectedService?.name}
						</Text>
					</Skill>

					{selectedContractor && selectedContractor.services.length > 1 ? (
						<>
							<Divider large />
							<SkillsView>
								<Text caption center style={{ fontSize: 16 }}>
									{selectedContractor?.name.split(' ')[0]} also does these
									works, want to change?
								</Text>
								<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
									{selectedContractor &&
										selectedContractor.services.map((s, index) => (
											<Skill
												onPress={() => dispatch(setSelectedService(s))}
												style={{
													backgroundColor:
														selectedService!.name!.toLowerCase() ===
														s!.name!.toLowerCase()
															? theme.ASCENT
															: theme.SECONDARY_BUTTON_COLOR,
													borderWidth:
														selectedService!.name!.toLowerCase() ===
														s!.name!.toLowerCase()
															? 1.5
															: 0,
													borderColor:
														selectedService!.name!.toLowerCase() ===
														s!.name!.toLowerCase()
															? theme.PRIMARY_BUTTON_COLOR
															: '',
												}}
												key={index.toString()}
											>
												<Text capitalize>{s.name}</Text>
											</Skill>
										))}
								</View>
							</SkillsView>
						</>
					) : null}
				</View>

				<Divider large />
				<View
					style={{
						paddingHorizontal: 10,

						alignItems: 'center',
						justifyContent: 'space-between',
					}}
				>
					<Text>Service Address:</Text>
					<TouchableOpacity
						onPress={() => setPickAddress(true)}
						style={{
							alignItems: 'center',
							justifyContent: 'center',
							backgroundColor: theme.SECONDARY_BUTTON_COLOR,
							paddingHorizontal: 10,
							paddingVertical: 10,
							borderRadius: SIZES.radius,
							width: '100%',
						}}
					>
						<Text center>{address ? address : 'Enter Address'}</Text>
					</TouchableOpacity>
				</View>
				<View style={{ padding: 10 }}>
					{apt && <Text bold>Apt, Unit, Suite: {apt}</Text>}
				</View>

				{/* PREFERRED CONTACT METHOD */}
				<PrefferedContactMethodView>
					<View>
						<Text bold>Contact Method: </Text>
					</View>

					<View
						style={{
							flexDirection: 'row',
							flex: 1,

							justifyContent: 'flex-end',
						}}
					>
						<Skill
							onPress={() => dispatch(setContactmethod('phone'))}
							style={{
								backgroundColor:
									contactMethod === 'phone' ? theme.ASCENT : '#ffffff',
								borderColor: theme.ASCENT,
								borderWidth: 1,

								flex: 1,
							}}
						>
							<Text darkText={contactMethod !== 'phone'}>Phone</Text>
						</Skill>
						<Skill
							onPress={() => dispatch(setContactmethod('email'))}
							style={{
								backgroundColor:
									contactMethod === 'email' ? theme.ASCENT : '#ffffff',
								borderColor: theme.ASCENT,
								borderWidth: 1,
								flex: 1,
							}}
						>
							<Text darkText={contactMethod !== 'email'}>Email</Text>
						</Skill>
					</View>
				</PrefferedContactMethodView>
				<DateOfServiceView>
					<View style={{ flex: 1 }}>
						<Text bold>Date of Service: </Text>
					</View>
					<Skill
						onPress={() => setShow(true)}
						style={{
							borderWidth: 1,
							borderColor: theme.ASCENT,
							backgroundColor: '#ffffff',

							flex: 1,
						}}
					>
						<Text darkText>{moment(serviceDate).format('ll')}</Text>
					</Skill>
				</DateOfServiceView>
				<DateOfServiceView>
					<View style={{ flex: 1 }}>
						<Text bold>Time / Window:</Text>
					</View>
					<Skill
						onPress={() => setHoursPicker(true)}
						style={{
							borderWidth: 1,
							borderColor: theme.ASCENT,
							backgroundColor: '#ffffff',
							flex: 1,
						}}
					>
						<Text darkText>
							{selectedHours ? selectedHours : 'Pick a Time'}
						</Text>
					</Skill>
				</DateOfServiceView>
				{Platform.OS === 'android' && show && (
					<DateTimePicker
						style={{
							width: '90%',
							alignSelf: 'center',
							height: '90%',
						}}
						testID='dateTimePicker'
						value={serviceDate}
						minimumDate={new Date(moment().format('YYYY-MM-DD'))}
						maximumDate={
							new Date(moment().add(3, 'months').format('YYYY-MM-DD'))
						}
						mode={'date'}
						display='default'
						onChange={onChange}
					/>
				)}
				<HoursPickerModal
					selectedHours={selectedHours}
					setHoursPicker={setHoursPicker}
					hoursPicker={hoursPicker}
					setSelectedHours={setSelectedHours}
				/>

				<Divider large />
				{/* PHOTOS UPLOAD */}
				<View>
					<ImagesContainer
						images={images}
						selectedImage={selectedImage}
						setSelectedImage={setSelectedImage}
						viewImage={viewImage}
						setViewImage={setViewImage}
					/>

					<SubmitRequestButton
						disabled={images.length === 5}
						onPress={pickImages}
					>
						<Text bold>
							{images.length === 5
								? 'Maximum 5 Images'
								: images.length > 0 && images.length < 5
								? 'Upload More'
								: 'Upload Images'}
						</Text>
					</SubmitRequestButton>
				</View>
				<Divider large />

				<View>
					<View>
						<InputField
							label='Description'
							ref={inputRef}
							contentStyle={{ minHeight: Layout.isSmallDevice ? 80 : 160 }}
							placeholder='Tell us a brief description about the service you are requesting.'
							multiline
							value={description}
							onChangeText={(text) => setDescription(text)}
						/>
					</View>
				</View>
				{renderDateTimeModal(SIZES)}
				<View>
					<SubmitRequestButton
						onPress={() => {
							if (!address) {
								// @ts-ignore
								alert('Pleaser enter a service address');

								return;
							}
							if (selectedHours === '') {
								Alert.alert('Error', 'Please select and time / window', [
									{ text: 'OK', onPress: () => setHoursPicker(true) },
								]);

								return;
							}

							if (description.length < 10) {
								Alert.alert(
									'Error',
									'Please type a description about the job',
									[{ text: 'OK', style: 'cancel' }]
								);
								scrollRef.current?.scrollToEnd();

								inputRef.current?.focus();

								return;
							}

							setShowReview(true);
						}}
					>
						<Text title>Send Request</Text>
					</SubmitRequestButton>
				</View>
			</KeyboardAwareScrollView>
			{renderAddressModal()}
			{renderReviewOfRequestModal(showReview)}

			<Modal visible={viewImage} animationType='slide'>
				<Screen>
					<TouchableOpacity
						onPress={() => setViewImage(false)}
						style={{
							justifyContent: 'center',
							alignItems: 'center',
							height: 60,
							zIndex: 99,
							width: 60,
							borderRadius: 30,
							backgroundColor: theme.SECONDARY_BUTTON_COLOR,
							position: 'absolute',
							right: 50,
							top: SIZES.statusBarHeight + 10,
						}}
					>
						<FontAwesome name='close' size={26} />
					</TouchableOpacity>
					<ImageBackground
						style={{ height: '100%', width: '100%' }}
						resizeMode='contain'
						source={{ uri: selectedImage ? selectedImage : '' }}
					/>
				</Screen>
			</Modal>
		</Screen>
	);
};

export default RequestServiceScreen;

const Header = styled.View`
	flex-direction: row;
	width: 100%;
	justify-content: space-between;
	align-items: center;
	margin: 1px 15px;
`;

const DateOfServiceView = styled.View`
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	margin: 5px 10px;
	flex: 1;
`;

const SkillsView = styled.View`
	padding: 10px;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	flex-wrap: wrap;
`;

const PrefferedContactMethodView = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	flex: 1;
	margin: 5px 10px;
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

const Overlay = styled.View`
	flex: 1;
	background-color: rgba(14, 13, 13, 0.733);
`;
