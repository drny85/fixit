import React, { FC } from 'react';
import { TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { useAppSelector } from '../redux/store';
import { createAnimatableComponent } from 'react-native-animatable';

interface Props {
	onPress: () => void;
}

const FloatingButton: FC<Props> = ({ onPress }) => {
	const theme = useAppSelector((state) => state.theme);
	const Icon = createAnimatableComponent(Entypo);

	return (
		<TouchableOpacity
			onPress={onPress}
			style={{
				position: 'absolute',
				right: 15,
				bottom: 15,
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
			<Icon
				animation='pulse'
				iterationCount='infinite'
				easing='ease-in-out'
				name='credit-card'
				duration={2000}
				size={26}
				color={'#ffffff'}
			/>
		</TouchableOpacity>
	);
};

export default FloatingButton;
