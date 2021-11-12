import { FontAwesome } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, useEffect } from 'react';
import { ListRenderItem, TouchableOpacity, View } from 'react-native';
import { Avatar } from 'react-native-elements/dist/avatar/Avatar';
import { FlatList } from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import { Screen, Text } from '../../../components';
import Layout from '../../../constants/Layout';

import { Contractor, contractorsData } from '../../../constants/Contractors';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import {
	getContractorByJob,
	getContractors,
	setSelectedContractor,
} from '../../../redux/contractorReducer/contractorsSlide';
import { HomeTabParamList } from '../../../types';
import { SIZES } from '../../../constants';

type Props = NativeStackScreenProps<HomeTabParamList, 'Contractors'>;

const ContractorByJob: FC<Props> = ({ route, navigation }) => {
	const { name } = route.params.service;
	const theme = useAppSelector((state) => state.theme);
	const dispatch = useAppDispatch();
	const { contratorsFiltered } = useAppSelector((state) => state.contractors);

	useEffect(() => {
		if (name) {
			dispatch(getContractorByJob(name));
		}
		return () => {};
	}, [dispatch, name]);

	const renderItems: ListRenderItem<Contractor> = ({ item }) => {
		return (
			<ContractorDetails
				onPress={() => {
					dispatch(setSelectedContractor(item));
					navigation.navigate('ContractorScreen', {
						contractor: item,
					});
				}}
				style={{
					shadowRadius: 8,
					shadowOpacity: 0.4,
					shadowOffset: { width: 6, height: 6 },
					elevation: 6,
					shadowColor: theme.SHADOW_COLOR,
					width: '100%',
				}}
				key={item.email}
			>
				<Avatar
					source={{
						uri:
							item.imageUrl ||
							'https://www.mtsolar.us/wp-content/uploads/2020/04/avatar-placeholder-293x300.png',
					}}
					rounded
					size='large'
				/>
				<View
					style={{
						flex: 1,
						justifyContent: 'center',
						margin: 5,
						alignItems: 'flex-start',
					}}
				>
					<Text center>{item.name}</Text>
					<Text center>{item.email}</Text>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center',
							width: '100%',
						}}
					>
						<Text center>{item.phone}</Text>

						{item.rating && (
							<Text style={{ color: theme.ASCENT }} caption>
								Rating {item.rating}
							</Text>
						)}
					</View>
				</View>
				<View>
					<FontAwesome
						name='chevron-right'
						size={24}
						color={theme.mode === 'dark' ? '#ffffff' : '#212121'}
					/>
				</View>
			</ContractorDetails>
		);
	};

	const renderHeader = () => {
		return (
			<Header
				style={{
					width: '100%',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<TouchableOpacity onPress={() => navigation.goBack()}>
					<FontAwesome
						name='chevron-left'
						size={24}
						color={theme.mode === 'dark' ? '#ffffff' : '#212121'}
					/>
				</TouchableOpacity>
				<Text capitalize center title>
					People for {name}
				</Text>
				<Text></Text>
			</Header>
		);
	};

	return (
		<Screen center>
			<ContractorsContainer>
				<FlatList
					ListHeaderComponent={
						<View style={{ marginBottom: 15, flex: 1 }}>
							{renderHeader()}
							{contratorsFiltered.length === 0 && (
								<View
									style={{
										flex: 1,
										justifyContent: 'center',
										alignItems: 'center',
									}}
								>
									<Text>No Results</Text>
								</View>
							)}
						</View>
					}
					contentContainerStyle={{
						width: SIZES.isSmallDevice ? SIZES.width * 0.95 : SIZES.width * 0.6,
						alignSelf: 'center',
					}}
					style={{ alignSelf: 'center', width: '100%' }}
					data={contratorsFiltered}
					keyExtractor={(item) => item.email}
					renderItem={renderItems}
				/>
			</ContractorsContainer>
		</Screen>
	);
};

export default ContractorByJob;

const ContractorsContainer = styled.View`
	flex: 1;
	padding: 10px;
`;
const ContractorDetails = styled.TouchableOpacity`
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding: 10px;
	margin: 10px;
	border-radius: 15px;
	margin: 10px 0px;
	background-color: ${({ theme }) => theme.PRIMARY_BUTTON_COLOR};
`;

const Header = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	padding: 10px;
`;
