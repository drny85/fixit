import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import { View } from 'react-native';
import { Header, Screen, Text } from '../../components';
import { logout } from '../../redux/authReducer/authActions';
import { AuthTabParamList } from '../../types';

type Props = NativeStackScreenProps<AuthTabParamList, 'SignupStatus'>;

const SignupStatus: FC<Props> = ({ route, navigation }) => {
	const { contractor } = route.params;
	const handleLogout = () => {
		logout();
		navigation.replace('LoginScreen');
	};
	return (
		<Screen center>
			<Header
				title={contractor.name}
				onPressRight={handleLogout}
				iconName='sign-out'
			/>
			<Text>Signup Status </Text>
		</Screen>
	);
};

export default SignupStatus;
