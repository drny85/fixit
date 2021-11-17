import React, { FC } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FlatList, ListRenderItem, View } from 'react-native';
import {
	Button,
	Header,
	Loader,
	RequestItem,
	Screen,
	Text,
} from '../../../components';
import { Request } from '../../../redux/requestReducer/requestActions';
import { RequestTabParamList } from '../../../types';
import useRequests from '../../../hooks/useRequests';

type Props = NativeStackScreenProps<RequestTabParamList, 'RequestScreen'>;

const RequestsScreen: FC<Props> = ({ navigation }) => {
	const { loading, requests, user } = useRequests();
	console.log(loading);

	const renderItem: ListRenderItem<Request> = ({ item }) => (
		<RequestItem
			request={item}
			onPress={() => navigation.navigate('RequestDetails', { request: item })}
		/>
	);

	if (loading) return <Loader />;

	return (
		<Screen>
			<Header title={user?.role === 'consumer' ? 'My Requests' : 'My Jobs'} />
			<View style={{ flex: 1 }}>
				{requests.length > 0 && !loading ? (
					<FlatList
						data={requests}
						keyExtractor={(_, index) => index.toString()}
						renderItem={renderItem}
					/>
				) : (
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

						<Button onPress={() => navigation.navigate('Home')}>
							<Text bold>Submit First Request</Text>
						</Button>
					</View>
				)}
			</View>
		</Screen>
	);
};

export default RequestsScreen;
