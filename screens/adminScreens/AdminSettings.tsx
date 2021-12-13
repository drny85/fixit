import React, { useState } from 'react';
import { Alert, Modal, View } from 'react-native';
import styled from 'styled-components/native';
import { Button, InputField, Screen, Text } from '../../components';
import ListItemSetting from '../../components/ListItemSetting';
import { SIZES } from '../../constants';
import { db } from '../../firebase';
import { logout } from '../../redux/authReducer/authActions';
import { useAppDispatch, useAppSelector } from '../../redux/store';

const AdminSettings = () => {
	const { user } = useAppSelector((state) => state.auth);
	const dispatch = useAppDispatch();
	const [showModal, setShowModal] = useState<boolean>(false);
	const [serviceName, setServiceName] = useState<string>('');
	const [serviceDescription, setServiceDescription] = useState<string>('');
	const theme = useAppSelector((state) => state.theme);

	const handleAddService = async () => {
		try {
			if (serviceName.length < 3 || serviceDescription.length < 3) {
				alert('Both fields are required');
				return;
			}
			await db
				.collection('services')
				.add({
					name: serviceName.toLowerCase(),
					description: serviceDescription,
				});
			setServiceName('');
			setServiceDescription('');
			setShowModal(false);
		} catch (error) {
			console.log(error);
		}
	};
	const hanldeLogOut = async () => {
		try {
			Alert.alert('Loggin Out', 'Are you sure you want exit', [
				{ text: 'NO', style: 'cancel' },
				{
					text: 'Yes, Exit',
					style: 'destructive',
					onPress: () => dispatch(logout()),
				},
			]);
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<Screen>
			<Header>
				<Text></Text>
				<Text title>
					{user?.firstName} {user?.lastName}
				</Text>
				<LogOut onPress={hanldeLogOut}>
					<Text>Log Out</Text>
				</LogOut>
			</Header>
			<View>
				<ListItemSetting
					title={'Add Services'}
					onPress={() => setShowModal(true)}
					containerStyle={{
						shadowColor: theme.SHADOW_COLOR,
						backgroundColor: theme.ASCENT,
					}}
				/>
			</View>
			<Modal
				visible={showModal}
				presentationStyle='fullScreen'
				animationType='slide'
			>
				<View
					style={{
						flex: 1,
						backgroundColor: theme.BACKGROUND_COLOR,
						paddingTop: SIZES.statusBarHeight,
					}}
				>
					<Header>
						<Text></Text>

						<LogOut onPress={() => setShowModal(false)}>
							<Text bold>Cancel</Text>
						</LogOut>
					</Header>
					<View>
						<InputField
							placeholder='Service Name'
							value={serviceName}
							autoCapitalize='words'
							onChangeText={(text) => setServiceName(text)}
						/>
						<InputField
							placeholder='Service Description'
							multiline
							contentStyle={{ minHeight: 80 }}
							value={serviceDescription}
							onChangeText={(text) => setServiceDescription(text)}
						/>

						<Button onPress={handleAddService}>
							<Text center bold>
								Add Service
							</Text>
						</Button>
					</View>
				</View>
			</Modal>
		</Screen>
	);
};

export default AdminSettings;

const Header = styled.View`
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	margin: 2px 10px;
`;

const LogOut = styled.TouchableOpacity`
	align-items: center;
	justify-content: center;
	padding: 8px;
`;
