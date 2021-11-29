import React, { FC } from 'react';
import { useNavigation } from '@react-navigation/core';
import styled from 'styled-components/native';
import { Button, Loader, Screen, Text } from '../../components';
import { functions } from '../../firebase';
import useContractors from '../../hooks/useContractors';
import useNotifications from '../../hooks/useNotifications';
import { AdminTabParamList } from '../../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<AdminTabParamList, 'Dashboard'>;

const Dashboard: FC<Props> = ({ navigation }) => {
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
			<DashboardCard
				onPress={() => navigation.navigate('ContractorsDashboard')}
			>
				<Text>New Applicants</Text>
				<Text>{users.filter((u) => u.isActive === false).length}</Text>
			</DashboardCard>
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

const DashboardCard = styled.TouchableOpacity`
	justify-content: space-between;
	align-items: center;
	flex-direction: row;
	padding: 10px 15px;
	border-radius: 15px;
	background-color: ${({ theme }) => theme.SECONDARY_BUTTON_COLOR};
`;
