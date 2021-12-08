import React, { FC, useEffect } from 'react';
import styled from 'styled-components/native';

import { Text, Screen, Loader } from '../../../components';
import { Service } from '../../../constants/Services';
import { setSelectedService } from '../../../redux/servicesReducer/servicesSlide';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { FontAwesome } from '@expo/vector-icons';

import { HomeTabParamList } from '../../../types';
import { getContractors } from '../../../redux/contractorReducer/contractorsSlide';
import { Contractor } from '../../../constants/Contractors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlatList, ListRenderItem } from 'react-native';
import { getServices } from '../../../redux/servicesReducer/servicesActions';
import useNotifications from '../../../hooks/useNotifications';
import { db } from '../../../firebase';
import { SIZES } from '../../../constants';

type Props = NativeStackScreenProps<HomeTabParamList, 'Home'>;

const Home: FC<Props> = ({ navigation }) => {
	const dispatch = useAppDispatch();
	const { services, loading } = useAppSelector((state) => state.services);
	const theme = useAppSelector((state) => state.theme);

	useNotifications();

	const navigateAndSetSelectedService = (service: Service) => {
		dispatch(setSelectedService(service));
		navigation.navigate('Contractors', { service });
	};

	const renderServices: ListRenderItem<Service> = ({
		item: service,
		index,
	}) => {
		return (
			<ServiceItem
				onPress={() => navigateAndSetSelectedService(service)}
				style={{
					shadowOffset: { height: 6, width: 6 },
					elevation: 8,
					shadowColor: theme.SHADOW_COLOR,
					shadowOpacity: 0.4,
					shadowRadius: 6,
				}}
				key={service.id + index.toString()}
			>
				<Text lightText capitalize large>
					{service.name}
				</Text>
				<FontAwesome name='chevron-right' />
			</ServiceItem>
		);
	};

	useEffect(() => {
		dispatch(getServices());
		//MODIFY LATER TO ONLY GET ACTIVE CONTRATORS
		const sub = db
			.collection('users')
			.where('role', '==', 'contractor')
			.where('isActive', '==', true)
			.where('connectedAccountId', '!=', null)
			.onSnapshot((snapshop) => {
				dispatch(
					getContractors(
						snapshop.docs.map((doc) => {
							return {
								id: doc.id,
								...doc.data(),
							};
						}) as Contractor[]
					)
				);
			});

		return sub;

		// return sub
	}, [dispatch]);

	if (loading) return <Loader />;
	return (
		<Screen>
			<ServicesContainer>
				<Header>
					<Text
						style={{ fontSize: 40, fontFamily: 'tange' }}
						numberOfLines={2}
						caption
						center
					>
						What would you like us to fix today for you?
					</Text>
				</Header>
				{services.length > 0 && (
					<FlatList
						contentContainerStyle={{
							width: SIZES.isSmallDevice
								? SIZES.width * 0.95
								: SIZES.width * 0.6,
							alignSelf: 'center',
						}}
						data={services}
						keyExtractor={(item, index) => index.toString()}
						renderItem={renderServices}
					/>
				)}
			</ServicesContainer>
		</Screen>
	);
};

export default Home;

const ServicesContainer = styled.View`
	flex: 1;
`;
const ServiceItem = styled.TouchableOpacity`
	padding: 10px 20px;
	border-radius: 10px;
	background-color: ${({ theme }) => theme.PRIMARY_BUTTON_COLOR};
	margin: 8px 15px;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
`;

const Header = styled.View`
	padding: 10px;
`;
