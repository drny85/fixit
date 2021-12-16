import React, { useEffect, useState } from 'react';
import { Modal, View } from 'react-native';
import { Button, Header, InputField, Screen, Text } from '../../../components';
import ListItemSetting from '../../../components/ListItemSetting';
import { logout } from '../../../redux/authReducer/authActions';
import { useAppDispatch, useAppSelector } from '../../../redux/store';

import { SIZES } from '../../../constants';
import { Contractor } from '../../../constants/Contractors';
import styled from 'styled-components/native';
import { Entypo } from '@expo/vector-icons';
import SkillsModalView from '../../../components/SkillsModalView';
import { getServices } from '../../../redux/servicesReducer/servicesActions';
import { setServicesSelected } from '../../../redux/servicesReducer/servicesSlide';
import { Service } from '../../../constants/Services';
import { db } from '../../../firebase';

const ContractorProfileScreen = () => {
	const { user } = useAppSelector((state) => state.auth);
	const [show, setShow] = useState<boolean>(false);
	const [showSkills, setShowSkills] = useState<boolean>(false);
	const theme = useAppSelector((state) => state.theme);
	const dispatch = useAppDispatch();
	const [userData, setUserData] = useState<Contractor>();
	const { services, servicesSelected } = useAppSelector(
		(state) => state.services
	);

	const calculateServices = (service: Service) => {
		const index = servicesSelected.findIndex((s) => s.id === service.id);

		if (index === -1) {
			dispatch(setServicesSelected([...servicesSelected, service]));
		} else {
			const newSkills = servicesSelected.filter((s) => s.id !== service.id);

			dispatch(setServicesSelected([...newSkills]));
		}
	};

	const handleUserUpdate = async () => {
		try {
			await db
				.collection('users')
				.doc(user?.id)
				.set({ ...userData, services: servicesSelected }, { merge: true });
			setShow(false);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		dispatch(getServices());

		if (user) {
			dispatch(setServicesSelected(user?.services!));
			setUserData(user);
		}
	}, [user]);

	return (
		<Screen>
			<Header
				title={user?.firstName + ' ' + user?.lastName}
				iconName='sign-out'
				onPressRight={() => dispatch(logout())}
			/>
			<ListItemSetting title='Edit Profile' onPress={() => setShow(true)} />
			<Modal visible={show} animationType='slide' transparent>
				<View
					style={{
						flex: 1,
						backgroundColor: theme.BACKGROUND_COLOR,
						borderTopEndRadius: 35,
						borderTopStartRadius: 35,
						height: SIZES.height * 0.9,
						marginTop: SIZES.statusBarHeight,
						shadowColor: theme.mode === 'dark' ? '#ffffff' : '#212121',
						shadowOffset: {
							height: 6,
							width: 10,
						},
						shadowOpacity: 0.6,
						shadowRadius: 10,
					}}
				>
					<Header onPressRight={() => setShow(false)} iconName='close' />
					<View style={{ flex: 1 }}>
						<InputField
							value={userData?.firstName!}
							placeholder='First Name'
							onChangeText={(text) =>
								setUserData({ ...userData!, firstName: text })
							}
						/>
						<InputField
							value={userData?.phone!}
							placeholder='Phone'
							onChangeText={(text) =>
								setUserData({ ...userData!, phone: text })
							}
						/>
						<View>
							<View
								style={{
									flexDirection: 'row',
									justifyContent: 'space-between',
									alignItems: 'center',
									marginHorizontal: SIZES.padding,
								}}
							>
								<Text center bold>
									ADD / REMOVE JOBS
								</Text>
								<Entypo
									name='squared-plus'
									onPress={() => {
										setShow(false);
										setShowSkills(true);
									}}
									size={26}
									color={theme.mode === 'dark' ? '#ffffff' : '#212121'}
								/>
							</View>

							<SkillsView>
								{servicesSelected.map((s) => (
									<Skill key={s.id}>
										<Text>{s.name}</Text>
									</Skill>
								))}
							</SkillsView>
						</View>
						<Button onPress={handleUserUpdate}>
							<Text bold center>
								Update
							</Text>
						</Button>
					</View>
				</View>
			</Modal>
			<SkillsModalView
				visible={showSkills}
				setVisible={() => {
					setShowSkills(false);
					setShow(true);
				}}
				onPress={calculateServices}
			/>
		</Screen>
	);
};

export default ContractorProfileScreen;

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

const SkillsView = styled.View`
	padding: 10px;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	flex-wrap: wrap;
`;
