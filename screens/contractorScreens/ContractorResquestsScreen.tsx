import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import { FlatList, ListRenderItem, View } from 'react-native';
import {
	Button,
	Header,
	Loader,
	RequestItem,
	Screen,
	Text,
} from '../../components';
import { SIZES } from '../../constants';
import useRequests from '../../hooks/useRequests';
import { Request } from '../../redux/requestReducer/requestActions';
import { ContractorRequestParamList } from '../../types';

type Props = NativeStackScreenProps<
	ContractorRequestParamList,
	'ContractorRequestsScreen'
>;

const ContractorResquestsScreen: FC<Props> = ({ navigation }) => {
	const { requests, loading, user } = useRequests();
	const renderItem: ListRenderItem<Request> = ({ item }) => (
		<RequestItem
			request={item}
			onPress={() =>
				navigation.navigate('ContractorRequestDetails', { request: item })
			}
		/>
	);

	if (loading) return <Loader />;

	return (
		<Screen>
			<Header title={'My Requests'} />
			<View style={{ marginTop: SIZES.statusBarHeight + 20 }}>
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
