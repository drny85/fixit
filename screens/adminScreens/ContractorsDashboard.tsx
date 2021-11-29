import { Entypo } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import styled from 'styled-components/native';
import { Screen, Text } from '../../components';
import { useAppSelector } from '../../redux/store';
import { AdminTabParamList, User } from '../../types';

type Props = NativeStackScreenProps<AdminTabParamList, 'ContractorsDashboard'>;

const ContractorsDashboard: FC<Props> = ({ navigation }) => {
	const { users } = useAppSelector((state) => state.auth);
	const theme = useAppSelector((state) => state.theme);

	const renderItems: ListRenderItem<User> = ({ item }) => {
		return (
			<UserCard
				onPress={() =>
					navigation.navigate('AdminContractorDetails', {
						contratorId: item.id!,
					})
				}
			>
				<Text>{item.name}</Text>
				<Entypo
					name='chevron-right'
					size={24}
					color={theme.mode === 'dark' ? '#ffffff' : '#212121'}
				/>
			</UserCard>
		);
	};
	return (
		<Screen>
			<Text center title>
				Contractors Dashboard
			</Text>
			{users.length > 0 && (
				<FlatList
					data={users}
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
	background-color: ${({ theme }) => theme.SECONDARY_BUTTON_COLOR};
`;

const UsersFlatList = styled.FlatList``;
