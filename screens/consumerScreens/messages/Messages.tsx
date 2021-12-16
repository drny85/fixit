import { Entypo } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import { FlatList, ListRenderItem, TouchableOpacity, View } from 'react-native';
import { Loader, Screen, Text } from '../../../components';
import { SIZES } from '../../../constants';
import useRequests from '../../../hooks/useRequests';
import { Request } from '../../../redux/requestReducer/requestActions';
import { setRequest } from '../../../redux/requestReducer/requestSlide';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { ConsumerMessageStackParams } from '../../../types';

type Props = NativeStackScreenProps<
	ConsumerMessageStackParams,
	'ConsumerMessageScreen'
>;
const Messages: FC<Props> = ({ navigation }) => {
	const { requests, loading } = useRequests();
	const theme = useAppSelector((state) => state.theme);
	const dispatch = useAppDispatch();

	const handleNavigateToChatScreen = (request: Request) => {
		dispatch(setRequest(request));
		navigation.navigate('ConsumerMessageDetails', { request });
	};

	const renderRequestItem: ListRenderItem<Request> = ({ item }) => {
		return (
			<TouchableOpacity
				style={{
					justifyContent: 'space-between',
					flexDirection: 'row',
					alignItems: 'center',
					paddingHorizontal: SIZES.padding,
					paddingVertical: SIZES.padding * 0.6,
					backgroundColor: theme.PRIMARY_BUTTON_COLOR,
					width: SIZES.width * 0.95,
					borderRadius: SIZES.radius,
					marginVertical: 8,
				}}
				onPress={() => handleNavigateToChatScreen(item)}
			>
				<View>
					<Text capitalize>About {item.service?.name}</Text>
					<Text bold>
						With {item.customer?.firstName} {item.customer?.lastName}
					</Text>
				</View>
				<Entypo name='chevron-thin-right' size={20} color={'#ffffff'} />
			</TouchableOpacity>
		);
	};
	if (loading) return <Loader />;
	return (
		<Screen center>
			<FlatList
				ListHeaderComponent={
					<View>
						<Text title>Chats</Text>
					</View>
				}
				data={requests}
				renderItem={renderRequestItem}
				keyExtractor={(item) => item.id!}
			/>
		</Screen>
	);
};

export default Messages;
