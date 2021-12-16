import React, { FC, useEffect } from 'react';
import styled from 'styled-components/native';

import { Text, Screen, Loader } from '../../../components';
import { Service } from '../../../constants/Services';
import {
	populateServices,
	setSelectedService,
} from '../../../redux/servicesReducer/servicesSlide';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { FontAwesome } from '@expo/vector-icons';

import { HomeTabParamList } from '../../../types';
import { getContractors } from '../../../redux/contractorReducer/contractorsSlide';
import { Contractor } from '../../../constants/Contractors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlatList, ListRenderItem, View } from 'react-native';
import useNotifications from '../../../hooks/useNotifications';
import { db } from '../../../firebase';
import { FONTS, SIZES } from '../../../constants';
import useLocation from '../../../hooks/useLocation';

type Props = NativeStackScreenProps<HomeTabParamList, 'Home'>;

const Home: FC<Props> = ({ navigation }) => {
	const dispatch = useAppDispatch();
	const { services, loading } = useAppSelector((state) => state.services);
	const theme = useAppSelector((state) => state.theme);
	const { contractors } = useAppSelector((state) => state.contractors);

	useNotifications();
	//const { location, errorMsg } = useLocation();

	const navigateAndSetSelectedService = (service: Service) => {
		dispatch(setSelectedService(service));
		navigation.navigate('Contractors', { service });
	};

	const calculateServicesToShow = React.useCallback(() => {
		const data: Service[] = [];
		contractors.forEach((c, i) => {
			c.services.forEach((s, index) => {
				if (data.findIndex((d) => d.id === s.id) === -1) {
					data.push(s);
				}
			});
		});

		return data.sort((a, b) => (a.name! > b.name! ? 1 : -1));
	}, [contractors.length]);

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
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}
				key={service.id + index.toString()}
			>
				<View
					style={{
						alignItems: 'center',
						justifyContent: 'space-between',
						width: '100%',
					}}
				>
					<Text lightText capitalize large>
						{service.name}
					</Text>
					{service.description && (
						<View style={{ padding: 5, width: '100%' }}>
							<Text lightText style={{ ...FONTS.body4 }}>
								{service.description}
							</Text>
						</View>
					)}
				</View>

				<FontAwesome name='chevron-right' size={16} color={'#ffffff'} />
			</ServiceItem>
		);
	};

	useEffect(() => {
		dispatch(populateServices(calculateServicesToShow()));
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
	}, [dispatch, contractors.length]);

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

	justify-content: space-between;
	align-items: center;
`;

const Header = styled.View`
	padding: 10px;
`;
