import React, { FC } from 'react';
import { View, TouchableOpacity, ViewStyle } from 'react-native';
import { Text } from '.';
import { SIZES } from '../constants';
import { useAppSelector } from '../redux/store';

interface Props {
	title: string;
	subtitle: string;
	onPress?: () => void;
	containerStyle?: ViewStyle;
}

const SmallCard: FC<Props> = ({ title, subtitle, onPress, containerStyle }) => {
	const theme = useAppSelector((state) => state.theme);
	return (
		<TouchableOpacity
			onPress={onPress}
			style={[
				{
					backgroundColor: theme.PRIMARY_BUTTON_COLOR,
					flex: 1,
					borderRadius: SIZES.radius,
					justifyContent: 'center',
					paddingVertical: SIZES.padding * 0.5,
					paddingHorizontal: SIZES.padding,
					margin: 5,
					alignItems: 'center',
				},
				containerStyle,
			]}
		>
			<Text>{title}</Text>
			<Text bold>{subtitle}</Text>
		</TouchableOpacity>
	);
};

export default SmallCard;
