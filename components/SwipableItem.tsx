import React, { FC } from 'react';
import { Entypo } from '@expo/vector-icons';
import { ViewStyle, Animated, TouchableOpacity } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { useAppSelector } from '../redux/store';

interface Props {
	style?: ViewStyle;
	onLeftIconPress?: () => void;
	rigthStyle?: ViewStyle;
	children?: React.ReactNode;
	hasTwoActions?: boolean;
	rigthIconName?: React.ComponentProps<typeof Entypo>['name'];
	leftIconName?: React.ComponentProps<typeof Entypo>['name'];
	onSwipeableWillOpen: () => void;
	onRightIconPress?: (value: any) => Promise<void>;
	ref: any;
}
const SwipableItem: FC<Props> = React.forwardRef(
	(
		{
			style,
			onLeftIconPress,
			onSwipeableWillOpen,
			children,
			rigthStyle,
			onRightIconPress,
			hasTwoActions,
			rigthIconName,
			leftIconName,
		},
		ref
	) => {
		const theme = useAppSelector((state) => state.theme);

		const renderRightActions = (_: any, dragX: any) => {
			const scale = dragX.interpolate({
				inputRange: [-125, 0],
				outputRange: [1, 0],
				extrapolate: 'clamp',
			});

			const opacity = dragX.interpolate({
				inputRange: [-100, -50, 0],
				outputRange: [1, 0.5, 0],
			});

			return (
				<Animated.View
					style={[rigthStyle, { transform: [{ scale }], opacity }]}
				>
					{hasTwoActions && leftIconName && (
						<TouchableOpacity
							onPress={onLeftIconPress}
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'center',
								height: '100%',
							}}
						>
							<Entypo
								name={leftIconName}
								size={24}
								color={theme.PRIMARY_BUTTON_COLOR}
							/>
						</TouchableOpacity>
					)}

					<TouchableOpacity
						onPress={onRightIconPress}
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'center',
							height: '100%',
						}}
					>
						<Entypo
							name={rigthIconName}
							size={24}
							color={theme.PRIMARY_BUTTON_COLOR}
						/>
					</TouchableOpacity>
				</Animated.View>
			);
		};
		return (
			<Swipeable
				overshootRight={false}
				ref={ref as any}
				containerStyle={[style, { width: '100%' }]}
				onSwipeableWillOpen={onSwipeableWillOpen}
				renderRightActions={renderRightActions}
			>
				{children}
			</Swipeable>
		);
	}
);

export default SwipableItem;
