import { Entypo } from '@expo/vector-icons';
import React, { FC } from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Text } from '.';
import { SIZES } from '../constants';
import { useAppSelector } from '../redux/store';

interface Props {
	title: string;
	onPress: () => void;
	containerStyle?: ViewStyle;
}

const ListItemSetting: FC<Props> = ({ title, onPress, containerStyle }) => {
	const theme = useAppSelector((state) => state.theme);
	return (
		<TouchableOpacity
			style={[
				styles.view,
				{ backgroundColor: theme.SHADOW_COLOR },
				containerStyle,
			]}
			onPress={onPress}
		>
			<Text lightText bold>
				{title}
			</Text>
			<Entypo name='chevron-right' size={24} color={'#ffffff'} />
		</TouchableOpacity>
	);
};

export default ListItemSetting;

const styles = StyleSheet.create({
	view: {
		paddingHorizontal: SIZES.padding,
		paddingVertical: SIZES.padding * 0.8,
		shadowOffset: {
			width: 6,
			height: 8,
		},
		elevation: 8,
		margin: 10,
		borderRadius: SIZES.radius,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
});
