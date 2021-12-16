import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';
import React, { FC } from 'react';
import { View, TouchableOpacity, ViewStyle } from 'react-native';
import { Text } from '.';
import { statusBarHeight } from '../constants/Layout';
import { useAppSelector } from '../redux/store';

interface Props {
	title?: string;
	canGoBack?: boolean;
	containerStyle?: ViewStyle;
	iconName?: React.ComponentProps<typeof FontAwesome>['name'];
	onPressRight?: () => void;
}
const Header: FC<Props> = ({
	title,
	onPressRight,
	iconName,
	canGoBack,
	containerStyle,
}) => {
	const navigation = useNavigation();
	const theme = useAppSelector((state) => state.theme);
	return (
		<View
			style={[
				{
					width: '100%',
					padding: 10,
					justifyContent: title ? 'space-between' : 'flex-start',
					alignItems: 'center',
					flexDirection: 'row',
					zIndex: 99,
				},
				containerStyle,
			]}
		>
			{canGoBack ? (
				<TouchableOpacity onPress={() => navigation.goBack()}>
					<FontAwesome
						name='chevron-left'
						size={26}
						color={theme.mode === 'dark' ? '#ffffff' : '#212121'}
					/>
				</TouchableOpacity>
			) : (
				<Text></Text>
			)}

			<Text numberOfLines={1} ellipsizeMode='tail' title center capitalize>
				{title}
			</Text>
			{onPressRight && iconName ? (
				<TouchableOpacity onPress={onPressRight}>
					<FontAwesome
						name={iconName}
						size={26}
						color={theme.mode === 'dark' ? '#ffffff' : '#212121'}
					/>
				</TouchableOpacity>
			) : (
				<Text></Text>
			)}
		</View>
	);
};

export default Header;
