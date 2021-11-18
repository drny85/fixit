import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, useEffect } from 'react';
import { FlatList, ListRenderItem, View } from 'react-native';
import { Header, Loader, RequestItem, Screen, Text } from '../../components';
import { SIZES } from '../../constants';

import useRequests from '../../hooks/useRequests';
import {
	Request,
	updateRequest,
} from '../../redux/requestReducer/requestActions';
import { setRequest } from '../../redux/requestReducer/requestSlide';
import { useAppDispatch } from '../../redux/store';
import { ContractorRequestParamList } from '../../types';

type Props = NativeStackScreenProps<
	ContractorRequestParamList,
	'ContractorRequestsScreen'
>;

const ContractorResquestsScreen: FC<Props> = ({ navigation }) => {
	const { requests, loading, user } = useRequests();
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
				dispatch(setRequest(item));
				navigation.navigate('ContractorRequestDetails');
			}}
		/>
	);

	useEffect(() => {}, []);

	if (loading) return <Loader />;

	return (
		<Screen>
			<Header title={'My Requests'} />
			<View
				style={{
					flex: 1,
					width: SIZES.isSmallDevice ? SIZES.width * 0.95 : SIZES.width * 0.7,
					alignSelf: 'center',
				}}
			>
				{requests.length > 0 && (
					<FlatList
						data={requests}
						keyExtractor={(_, index) => index.toString()}
						renderItem={renderItem}
					/>
				)}
			</View>
			{requests.length === 0 && !loading && (
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
			)}
		</Screen>
	);
};

export default ContractorResquestsScreen;
