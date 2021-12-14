import React, { FC, useEffect } from 'react';

import styled from 'styled-components/native';
import { Button, Loader, Screen, Text } from '../../components';
import { db, functions } from '../../firebase';
import useContractors from '../../hooks/useContractors';
import useNotifications from '../../hooks/useNotifications';
import { AdminTabParamList, DashboardStackParams } from '../../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View, StyleSheet } from 'react-native';
import { SIZES } from '../../constants';
import { useAppSelector } from '../../redux/store';
import { getRequests } from '../../redux/requestReducer/requestSlide';
import useRequests from '../../hooks/useRequests';

type Props = NativeStackScreenProps<AdminTabParamList, 'DashboardStack'>;

const Dashboard: FC<Props> = ({ navigation }) => {
	useNotifications();
	const { requests, user } = useRequests();
	const theme = useAppSelector((state) => state.theme);
	const { users, loading } = useContractors();

	if (loading) return <Loader />;

	return (
		<Screen>
			<DashboardCardContainer style={{ flexDirection: 'row' }}>
				<DashboardCard
					style={[styles.shadow, { shadowColor: theme.PRIMARY_BUTTON_COLOR }]}
					onPress={() =>
						navigation.navigate('ContractorsDashboard', {
							screen: 'AdminContractorsDashboard',
							params: { contractorStatus: 'new' },
						})
					}
				>
					<Text caption>Inactive</Text>
					<Text bold title>
						{users.filter((u) => !u.isActive && !u.connectedAccountId).length}
					</Text>
				</DashboardCard>
				<DashboardCard
					style={[
						styles.shadow,
						{
							shadowColor: theme.PRIMARY_BUTTON_COLOR,
						},
					]}
					onPress={() =>
						navigation.navigate('ContractorsDashboard', {
							screen: 'AdminContractorsDashboard',
							params: { contractorStatus: 'active' },
						})
					}
				>
					<Text caption>No Account</Text>
					<Text title>
						{users.filter((u) => u.isActive && !u.connectedAccountId).length}
					</Text>
				</DashboardCard>
				<DashboardCard
					style={[
						styles.shadow,
						{
							shadowColor: theme.PRIMARY_BUTTON_COLOR,
						},
					]}
					onPress={() =>
						navigation.navigate('ContractorsDashboard', {
							screen: 'AdminContractorsDashboard',
							params: { contractorStatus: 'active' },
						})
					}
				>
					<Text caption>Active</Text>
					<Text title>
						{users.filter((u) => u.isActive && u.connectedAccountId).length}
					</Text>
				</DashboardCard>
			</DashboardCardContainer>
			<ListItem
				style={[
					{
						shadowColor: theme.SHADOW_COLOR,
					},
					styles.shadow,
				]}
			>
				<Text>All Accounts!</Text>
				<Text bold>{users.length}</Text>
			</ListItem>
			<ListItem
				style={[
					{
						shadowColor: theme.SHADOW_COLOR,
					},
					styles.shadow,
				]}
			>
				<Text>New Requests</Text>
				<Text bold>
					{requests.filter((r) => r.status === 'pending').length}
				</Text>
			</ListItem>
			<ListItem
				style={[
					{
						shadowColor: theme.SHADOW_COLOR,
					},
					styles.shadow,
				]}
			>
				<Text>Opened Requests</Text>
				<Text bold>
					{requests.filter((r) => r.status !== 'completed').length}
				</Text>
			</ListItem>
			<ListItem
				style={[
					{
						shadowColor: theme.SHADOW_COLOR,
					},
					styles.shadow,
				]}
			>
				<Text>Waiting for Payment</Text>
				<Text bold>
					{requests.filter((r) => r.status === 'waiting for payment').length}
				</Text>
			</ListItem>
			<ListItem
				style={[
					{
						shadowColor: theme.SHADOW_COLOR,
					},
					styles.shadow,
				]}
			>
				<Text>Completed / Paid</Text>
				<Text bold>
					{requests.filter((r) => r.status === 'completed').length}
				</Text>
			</ListItem>

			{/* <Button onPress={makeUserAContractor}>
				<Text>Make Admin</Text>
			</Button> */}
		</Screen>
	);
};

export default Dashboard;

const styles = StyleSheet.create({
	shadow: {
		shadowOffset: { width: 6, height: 6 },
		elevation: 6,
		shadowOpacity: 0.3,
		shadowRadius: 4,
	},
});

const ListItem = styled.TouchableOpacity`
	justify-content: space-between;
	flex-direction: row;
	margin: 10px;
	padding: 10px;
	border-radius: 10px;
	background-color: ${({ theme }) => theme.PRIMARY_BUTTON_COLOR};
`;

const NewContractorView = styled.View`
	padding: 15px;
	flex: 1;
	align-items: center;
	justify-content: center;
	background-color: ${({ theme }) => theme.PRIMARY_BUTTON_COLOR};
	margin: 5px 10px;
	border-radius: 15px;
`;

const DashboardCardContainer = styled.View``;

const DashboardCard = styled.TouchableOpacity`
	justify-content: space-between;
	align-items: center;
	flex: 1;
	padding: 15px 10px;
	margin: 8px;
	border-radius: 15px;
	background-color: ${({ theme }) => theme.BACKGROUND_COLOR};
`;
