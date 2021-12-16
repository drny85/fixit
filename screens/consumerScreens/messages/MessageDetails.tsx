import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import moment from 'moment';
import React, { FC, useState } from 'react';
import { FlatList, ListRenderItem, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Header, Loader, InputField } from '../../../components';
import ChatMessageItem from '../../../components/ChatMessageItem';
import { SIZES } from '../../../constants';
import { db } from '../../../firebase';
import useMessages, { Message } from '../../../hooks/useMessages';
import { useAppSelector } from '../../../redux/store';
import { ContractorMessageStackParams } from '../../../types';

type Props = NativeStackScreenProps<
	ContractorMessageStackParams,
	'ContractorMessageDetails'
>;
const MessageDetails: FC<Props> = ({ route }) => {
	const { messages, loading } = useMessages();
	const [sending, setSending] = useState<boolean>(false);
	const [message, setMessage] = useState<string>('');
	const theme = useAppSelector((state) => state.theme);
	const { user } = useAppSelector((state) => state.auth);
	const { request } = route.params;

	const handleSendMessage = async () => {
		try {
			if (message.length === 0) {
				alert('Please type a message');
				return;
			}
			setSending(true);
			const newMessage: Message = {
				receiverId:
					user?.role === 'contractor'
						? request.customer?.id!
						: request.contractor?.id!,
				senderId: user?.id!,
				requestId: request.id!,
				body: message,
				sentOn: new Date().toISOString(),
			};
			db.collection('chats')
				.doc(route.params.request.id)
				.collection('messages')
				.add(newMessage);

			setMessage('');
		} catch (error) {
			console.log(error);
		} finally {
			setSending(false);
		}
	};

	const renderMessages: ListRenderItem<Message> = ({ item }) => {
		return (
			<ChatMessageItem
				body={item.body}
				sender={item.senderId}
				timestamp={moment(item.sentOn).format('h:m')}
			/>
		);
	};
	if (loading) return <Loader />;
	return (
		<KeyboardAwareScrollView
			keyboardShouldPersistTaps='handled'
			keyboardDismissMode='on-drag'
			contentContainerStyle={{
				flex: 1,
				width: SIZES.width,
				backgroundColor: theme.BACKGROUND_COLOR,
			}}
		>
			<Header
				containerStyle={{ marginTop: SIZES.statusBarHeight }}
				canGoBack
				title={`Chat with ${route.params.request.customer?.firstName}`}
			/>
			<View
				style={{
					justifyContent: 'space-between',
					height: SIZES.height * 0.9,
				}}
			>
				<FlatList
					keyboardShouldPersistTaps='handled'
					data={messages.sort((a, b) => (a.sentOn > b.sentOn ? 1 : -1))}
					keyExtractor={(item) => item.id!}
					renderItem={renderMessages}
				/>
			</View>
			<View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
				<InputField
					containerStyle={{ borderRadius: SIZES.radius * 2 }}
					placeholder='Type a message'
					value={message}
					onChangeText={setMessage}
					rightIcon={
						message.length > 0 ? (
							<TouchableOpacity disabled={sending} onPress={handleSendMessage}>
								<MaterialCommunityIcons
									name='send'
									size={26}
									color={theme.TEXT_COLOR}
								/>
							</TouchableOpacity>
						) : undefined
					}
				/>
			</View>
		</KeyboardAwareScrollView>
	);
};

export default MessageDetails;
