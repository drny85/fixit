// @ts-ignore
import React, { FC } from 'react';
import { Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
// @ts-ignore
import { email } from 'react-native-communications';
import { FONTS } from '../constants';
import { Request } from '../redux/requestReducer/requestActions';
import { isContractor } from '../utils/isContractor';

interface Props {
	request: Request;
	style?: ViewStyle;
	textStyle?: TextStyle;
}
const EmailLink: FC<Props> = ({ request, style, textStyle }) => {
	const sendemail = async () => {
		try {
			email(
				[
					isContractor(request)
						? request.customer?.email!
						: request.contractor?.email!,
				],
				null,
				null,
				request.service?.name!,
				null
			);
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<TouchableOpacity style={{ ...style }} onPress={sendemail}>
			<Text style={{ ...FONTS.body3, ...textStyle, color: '#5792E3' }}>
				{isContractor(request)
					? request.customer?.email
					: request.contractor?.email}
			</Text>
		</TouchableOpacity>
	);
};

export default EmailLink;
