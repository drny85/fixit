import React from 'react';
import { View } from 'react-native';
import { Header, Screen, Text } from '../../components';
import { logout } from '../../redux/authReducer/authActions';
import { useAppDispatch, useAppSelector } from '../../redux/store';

const ContractorProfileScreen = () => {
	const { user } = useAppSelector((state) => state.auth);
	const dispatch = useAppDispatch();

	return (
		<Screen>
			<Header
				title={user?.firstName + ' ' + user?.lastName}
				iconName='sign-out'
				onPressRight={() => dispatch(logout())}
			/>
			<Text center>Profile</Text>
		</Screen>
	);
};

export default ContractorProfileScreen;
