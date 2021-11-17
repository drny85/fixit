import React, { FC } from 'react';
import { Entypo } from '@expo/vector-icons';
import moment from 'moment';
import { View, ViewStyle, Animated, TouchableOpacity } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Text } from '.';
import { FONTS, SIZES } from '../constants';

import { Log, Theme } from '../types';

interface Props {
	log: Log;
	onPress?: () => void;
	style?: ViewStyle;
	onSwipeableWillOpen: () => void;
	onDelete?: () => void;
	theme: Theme;
	ref: any;
}

const LogItem: FC<Props> = React.forwardRef(
	({ log, onPress, style, onDelete, onSwipeableWillOpen, theme }, ref) => {
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
				<Animated.View style={{ transform: [{ scale }], opacity }}>
					<TouchableOpacity
						onPress={onDelete}
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'center',
							height: '100%',
						}}
					>
						<Entypo name='trash' size={24} color={theme.PRIMARY_BUTTON_COLOR} />
						<Text style={{ ...FONTS.h3, paddingLeft: 10, opacity }}>
							Delete
						</Text>
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
				<View
					style={{
						shadowColor: theme.PRIMARY_BUTTON_COLOR,
						shadowOffset: { width: 5, height: 3 },
						shadowOpacity: 0.4,
						shadowRadius: 6,
						elevation: 6,
						marginVertical: SIZES.padding * 0.3,
						backgroundColor: theme.PRIMARY_BUTTON_COLOR,
						padding: SIZES.padding * 0.3,
						borderRadius: SIZES.radius,
					}}
				>
					<Text bold>{log.body}</Text>
					<Text caption right>
						{moment(log.loggedOn).format('llll')}
					</Text>
				</View>
			</Swipeable>
		);
	}
);

export default LogItem;
