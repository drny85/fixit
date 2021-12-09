import React, { FC } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { useAppSelector } from '../redux/store';
import { createAnimatableComponent, View } from 'react-native-animatable';
import { MotiView } from 'moti';
import { Easing } from 'react-native-reanimated';

interface Props {
	onPress: () => void;
}

const FloatingButton: FC<Props> = ({ onPress }) => {
	const theme = useAppSelector((state) => state.theme);
	const Icon = createAnimatableComponent(Entypo);

	return (
		<View
			style={{
				justifyContent: 'center',
				alignContent: 'center',
			}}
		>
			{[...Array(3).keys()].map((index) => (
				<MotiView
					from={{ opacity: 0.7, scale: 1 }}
					animate={{ opacity: 0, scale: 2 }}
					transition={{
						type: 'timing',
						duration: 2000,
						easing: Easing.out(Easing.ease),
						delay: index * 700,
						repeatReverse: false,

						loop: true,
					}}
					key={index}
					style={[
						StyleSheet.absoluteFillObject,
						{
							backgroundColor: theme.PRIMARY_BUTTON_COLOR,
							height: 60,
							width: 60,
							borderRadius: 30,
							justifyContent: 'center',
							alignItems: 'center',
						},
					]}
				/>
			))}
			<TouchableOpacity
				onPress={onPress}
				style={{
					height: 60,
					width: 60,
					borderRadius: 30,
					justifyContent: 'center',
					alignItems: 'center',
					elevation: 8,
					shadowColor: theme.SHADOW_COLOR,
					shadowOffset: { width: 6, height: 8 },
					backgroundColor: theme.PRIMARY_BUTTON_COLOR,
					zIndex: 104,
				}}
			>
				<Entypo
					name='credit-card'
					size={24}
					color={theme.mode === 'light' ? '#212121' : '#ffffff'}
				/>
			</TouchableOpacity>
		</View>
	);
};

export default FloatingButton;
