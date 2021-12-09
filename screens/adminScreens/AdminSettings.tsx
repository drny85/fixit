import React from 'react';
import { Alert, View } from 'react-native';
import styled from 'styled-components/native';
import { Screen, Text } from '../../components';
import ListItemSetting from '../../components/ListItemSetting';
import { logout } from '../../redux/authReducer/authActions';
import { useAppDispatch, useAppSelector } from '../../redux/store';

const AdminSettings = () => {
	const { user } = useAppSelector((state) => state.auth);
	const dispatch = useAppDispatch();
	const theme = useAppSelector((state) => state.theme);
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
					onPress={() => {}}
					containerStyle={{
						shadowColor: theme.SHADOW_COLOR,
						backgroundColor: theme.ASCENT,
					}}
				/>
			</View>
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
