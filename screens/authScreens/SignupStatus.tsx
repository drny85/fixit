import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import { Alert, View } from 'react-native';
import styled from 'styled-components/native';
import { Button, Header, Screen, Text } from '../../components';
import { logout } from '../../redux/authReducer/authActions';
import { AuthTabParamList } from '../../types';

type Props = NativeStackScreenProps<AuthTabParamList, 'SignupStatus'>;

const SignupStatus: FC<Props> = ({ route, navigation }) => {
	const { contractor } = route.params;
	console.log(contractor);
	const handleLogout = () => {
		logout();
		navigation.replace('LoginScreen');
	};
	return (
		<Screen>
			<Header
				title={contractor.name}
				onPressRight={handleLogout}
				iconName='sign-out'
			/>
			<Container>
				<Text>Signup Status: </Text>
				<Text large>
					{contractor.isActive ? 'Active' : 'Not Active / Pending'}{' '}
				</Text>
				<Button onPress={() => navigation.goBack()}>
					<Text>Request an Update</Text>
				</Button>
			</Container>
		</Screen>
	);
};

export default SignupStatus;

const Container = styled.View`
	flex: 1;
	justify-content: center;
	align-items: center;
`;
