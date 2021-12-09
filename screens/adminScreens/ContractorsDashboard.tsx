import { Entypo } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, useEffect, useState } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import styled from 'styled-components/native';
import { Loader, Screen, Text } from '../../components';
import { Contractor } from '../../constants/Contractors';
import { useAppSelector } from '../../redux/store';
import { ContractorsDashboardParams } from '../../types';

type Props = NativeStackScreenProps<
	ContractorsDashboardParams,
	'AdminContractorsDashboard'
>;

const ContractorsDashboard: FC<Props> = ({ route, navigation }) => {
	const { users } = useAppSelector((state) => state.auth);
	const [contractors, setContractors] = useState<Contractor[]>([]);

	const contractorStatus = route.params?.contractorStatus;
	console.log(contractorStatus);
	const [loading, setLoading] = useState<boolean>(true);
	const theme = useAppSelector((state) => state.theme);

	const renderItems: ListRenderItem<Contractor> = ({ item }) => {
		return (
			<UserCard
				onPress={() =>
					navigation.navigate('AdminContractorDetails', {
						contractorId: item.id!,
					})
				}
			>
				<Text lightText bold>
					{item.firstName} {item.lastName}
				</Text>
				<Entypo name='chevron-right' size={24} color={'#ffffff'} />
			</UserCard>
		);
	};

	useEffect(() => {
		if (contractorStatus && contractorStatus === 'new') {
			setContractors(users.filter((u) => !u.isActive));
			setLoading(false);
		} else {
			setContractors(users);
			setLoading(false);
		}
	}, [contractorStatus]);
	console.log(users.length);

	if (loading) return <Loader />;
	return (
		<Screen>
			<Text center title>
				Contractors Dashboard
			</Text>
			{users.length > 0 && (
				<FlatList
					data={contractors}
					keyExtractor={(item, index) => index.toString()}
					renderItem={renderItems}
				/>
			)}
		</Screen>
	);
};

export default ContractorsDashboard;

const UserCard = styled.TouchableOpacity`
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding: 25px 15px;
	margin: 10px 5px;
	border-radius: 15px;
	background-color: ${({ theme }) => theme.ASCENT};
`;

const UsersFlatList = styled.FlatList``;
