import React, { FC } from 'react';

import styled from 'styled-components/native';
import { Button, Loader, Screen, Text } from '../../components';
import { functions } from '../../firebase';
import useContractors from '../../hooks/useContractors';
import useNotifications from '../../hooks/useNotifications';
import { AdminTabParamList, DashboardStackParams } from '../../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View, StyleSheet } from 'react-native';
import { SIZES } from '../../constants';
import { useAppSelector } from '../../redux/store';

type Props = NativeStackScreenProps<AdminTabParamList, 'Dashboard'>;

const Dashboard: FC<Props> = ({ navigation }) => {
	useNotifications();
	const theme = useAppSelector((state) => state.theme);
	const { users, loading } = useContractors();

	if (loading) return <Loader />;

	return (
		<Screen>
			<DashboardCardContainer style={{ flexDirection: 'row' }}>
				<DashboardCard
					style={[styles.shadow, { shadowColor: theme.ASCENT }]}
					onPress={() =>
						navigation.navigate('ContractorsDashboard', {
							screen: 'AdminContractorsDashboard',
							params: { contractorStatus: 'new' },
						})
					}
				>
					<Text>New Contractos</Text>
					<Text bold title>
						{users.filter((u) => u.isActive === false).length}
					</Text>
				</DashboardCard>
				<DashboardCard
					style={[
						styles.shadow,
						{
							shadowColor: theme.ASCENT,
						},
					]}
					onPress={() =>
						navigation.navigate('ContractorsDashboard', {
							screen: 'AdminContractorsDashboard',
							params: { contractorStatus: 'active' },
						})
					}
				>
					<Text>All Contractors</Text>
					<Text title>{users.length}</Text>
				</DashboardCard>
			</DashboardCardContainer>

			{/* <Button onPress={makeUserAContractor}>
				<Text>Make Admin</Text>
			</Button> */}
		</Screen>
	);
};

export default Dashboard;

const styles = StyleSheet.create({
	shadow: {
		shadowOffset: { width: 6, height: 8 },
		elevation: 8,
		shadowOpacity: 0.7,
		shadowRadius: 6,
	},
});

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
