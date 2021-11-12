// @ts-ignore
import React, { FC } from 'react';
import { Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
// @ts-ignore
import Communications from 'react-native-communications';
import { FONTS } from '../constants';

interface Props {
	phone: string;
	style?: ViewStyle;
	textStyle?: TextStyle;
}
const PhoneCall: FC<Props> = ({ phone, style, textStyle }) => {
	const makeCall = async () => {
		try {
			Communications.phonecall(phone.replace(/-/g, ''), true);
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<TouchableOpacity style={{ ...style }} onPress={makeCall}>
			<Text style={{ ...FONTS.body3, ...textStyle, color: '#5792E3' }}>
				{phone}
			</Text>
		</TouchableOpacity>
	);
};

export default PhoneCall;
