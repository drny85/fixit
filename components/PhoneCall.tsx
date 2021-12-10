// @ts-ignore
import React, { FC } from 'react';
import { TouchableOpacity, ViewStyle, TextStyle, View } from 'react-native';

// @ts-ignore
import Communications from 'react-native-communications';
import { Text } from '.';
import { FONTS } from '../constants';

interface Props {
	phone: string;
	style?: ViewStyle;
	title?: string;
	textStyle?: TextStyle;
	titleStyle?: TextStyle;
	containerStyle?: ViewStyle;
}
const PhoneCall: FC<Props> = ({
	phone,
	style,
	textStyle,
	title,
	containerStyle,
	titleStyle,
}) => {
	const makeCall = async () => {
		try {
			Communications.phonecall(phone.replace(/-/g, ''), true);
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<View
			style={[{ flexDirection: 'row', alignItems: 'center' }, containerStyle]}
		>
			<Text capitalize style={titleStyle}>
				{title}
			</Text>
			<TouchableOpacity style={{ ...style }} onPress={makeCall}>
				<Text
					style={[{ ...FONTS.h4, ...textStyle, color: '#5792E3' }, textStyle]}
				>
					{phone}
				</Text>
			</TouchableOpacity>
		</View>
	);
};

export default PhoneCall;
