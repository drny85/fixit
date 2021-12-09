import { FontAwesome } from '@expo/vector-icons';
import React, { FC, useState } from 'react';
import { Alert, View } from 'react-native';
import styled from 'styled-components/native';
import { InputField, Screen, Text } from '../../../components';
import { logout } from '../../../redux/authReducer/authActions';
import { useAppDispatch, useAppSelector } from '../../../redux/store';

const SettingsScreen: FC = () => {
	const dispatch = useAppDispatch();
	const { user } = useAppSelector((state) => state.auth);

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
				<Text title>{`${user?.firstName} ${user?.lastName}`}</Text>
				<LogOut onPress={hanldeLogOut}>
					<Text>Log Out</Text>
				</LogOut>
			</Header>
			<View></View>
		</Screen>
	);
};

export default SettingsScreen;

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
