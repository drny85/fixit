import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, useEffect, useState } from 'react';
import { FlatList, ListRenderItem, View } from 'react-native';
import { Header, Loader, RequestItem, Screen, Text } from '../../../components';
import { SIZES } from '../../../constants';

import useRequests from '../../../hooks/useRequests';
import { logout } from '../../../redux/authReducer/authActions';
import {
	Request,
	updateRequest,
} from '../../../redux/requestReducer/requestActions';
import { setRequest } from '../../../redux/requestReducer/requestSlide';
import { useAppDispatch } from '../../../redux/store';
import { ContractorRequestStackParams } from '../../../types';

type Props = NativeStackScreenProps<
	ContractorRequestStackParams,
	'ContractorResquestsScreen'
>;

const ContractorResquestsScreen: FC<Props> = ({ navigation, route }) => {
	const { requests, loading } = useRequests();
	const [filteredRequests, setFilteredRequests] = useState<Request[]>([]);
	const dispatch = useAppDispatch();
	const onAcceptRequest = async (request: Request) => {
		try {
			const newRequest = { ...request };
			newRequest.status = 'accepted';
			await dispatch(updateRequest(newRequest));
		} catch (error) {}
	};
	const renderItem: ListRenderItem<Request> = ({ item }) => (
		<RequestItem
			onAcceptRequest={() => onAcceptRequest(item)}
			request={item}
			onPress={() => {
				navigation.navigate('ContractorRequestDetails', { request: item });
			}}
		/>
	);
	useEffect(() => {
		if (route.params?.requestsStatus) {
			setFilteredRequests(
				requests.filter((r) => r.status === route.params?.requestsStatus)
			);
		} else {
			setFilteredRequests(requests);
		}

		const navSub = navigation.addListener('blur', () => {
			setFilteredRequests(requests);
			navigation.setParams({
				requestsStatus: undefined,
			});
		});
		return navSub;
	}, [route.params?.requestsStatus]);

	if (loading) return <Loader />;

	return (
		<Screen>
			<Header
				title={
					route.params?.requestsStatus
						? route.params.requestsStatus
						: 'All Requests'
				}
			/>
			<View
				style={{
					flex: 1,
					width: SIZES.isSmallDevice ? SIZES.width * 0.95 : SIZES.width * 0.7,
					alignSelf: 'center',
				}}
			>
				{requests.length > 0 && (
					<FlatList
						data={filteredRequests}
						keyExtractor={(_, index) => index.toString()}
						renderItem={renderItem}
					/>
				)}
			</View>
			{requests.length === 0 ||
				(filteredRequests.length === 0 && (
					<View
						style={{
							flex: 1,
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<Text bold center>
							No Request
						</Text>
					</View>
				))}
		</Screen>
	);
};

export default ContractorResquestsScreen;
