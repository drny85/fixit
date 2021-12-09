import { Entypo } from '@expo/vector-icons';
import React, { FC } from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Text } from '.';
import { SIZES } from '../constants';

interface Props {
	title: string;
	onPress: () => void;
	containerStyle?: ViewStyle;
}

const ListItemSetting: FC<Props> = ({ title, onPress, containerStyle }) => {
	return (
		<TouchableOpacity style={[styles.view, containerStyle]} onPress={onPress}>
			<Text lightText bold title>
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
