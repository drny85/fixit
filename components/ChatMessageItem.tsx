import React, { FC } from 'react';
import { View } from 'react-native';
import { Text } from '.';
import { SIZES } from '../constants';
import { useAppSelector } from '../redux/store';

interface Props {
	body: string;
	sender: string;
	timestamp: string;
}
const ChatMessageItem: FC<Props> = ({ timestamp, body, sender }) => {
	const { user } = useAppSelector((state) => state.auth);
	const theme = useAppSelector((state) => state.theme);
	const isMe = () => user?.id === sender;
	return (
		<View
			style={{
				width: SIZES.width * 0.8,
				paddingVertical: SIZES.padding * 0.3,
				paddingHorizontal: SIZES.padding * 0.3,
				backgroundColor: isMe()
					? theme.PRIMARY_BUTTON_COLOR
					: theme.SECONDARY_BUTTON_COLOR,
				elevation: 8,
				borderRadius: SIZES.radius,
				marginVertical: SIZES.padding * 0.5,
				shadowColor: theme.SHADOW_COLOR,
				marginLeft: isMe() ? 10 : undefined,
				marginRight: isMe() ? 10 : undefined,

				shadowOffset: {
					width: 4,
					height: 4,
				},
				shadowOpacity: 0.4,
				shadowRadius: 3,
				alignSelf: isMe() ? 'flex-end' : 'flex-start',
			}}
		>
			<Text>{body}</Text>
			<Text caption right>
				{timestamp}
			</Text>
		</View>
	);
};

export default ChatMessageItem;
