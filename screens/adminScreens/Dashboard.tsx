import axios from 'axios';
import React, { FC } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { Button, Loader, Screen, Text } from '../../components';
import { functions } from '../../firebase';
import useContractors from '../../hooks/useContractors';
import useNotifications from '../../hooks/useNotifications';

const Dashboard: FC = () => {
	useNotifications();
	const { users, loading } = useContractors();

	if (loading) return <Loader />;

	const makeUserAContractor = async () => {
		try {
			const funcRef = functions.httpsCallable('makeUserAContractor');

			await funcRef({ email: 'drny85@gmail.com' });
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<Screen center>
			<Text>Admin Dashboard</Text>
			<Button onPress={makeUserAContractor}>
				<Text>Make Admin</Text>
			</Button>
		</Screen>
	);
};

export default Dashboard;

const NewContractorView = styled.View`
	padding: 15px;
	align-items: center;
	justify-content: center;
	background-color: ${({ theme }) => theme.PRIMARY_BUTTON_COLOR};
	margin: 5px 10px;
	border-radius: 15px;
`;
