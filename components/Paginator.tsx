import React, { FC } from 'react';
import { useWindowDimensions, View, Animated } from 'react-native';
import { Theme } from '../types';

export interface DataProps {
	id: string;
	title: string;
	subtitle?: string;
	imageUrl: string;
	buttons?: string[];
}

interface Props {
	data: DataProps[];
	scrollX: Animated.Value;
	theme: Theme;
}
const Paginator: FC<Props> = ({ data, scrollX, theme }) => {
	const { width } = useWindowDimensions();

	return (
		<View style={{ flexDirection: 'row', height: 20 }}>
			{data.map((_, i) => {
				const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
				const dotWidth = scrollX.interpolate({
					inputRange,
					outputRange: [10, 20, 10],
					extrapolate: 'clamp',
				});

				const opacity = scrollX.interpolate({
					inputRange,
					outputRange: [0.5, 1, 0.5],
					extrapolate: 'clamp',
				});

				return (
					<Animated.View
						key={i.toString()}
						style={{
							height: 10,
							width: dotWidth,
							borderRadius: 5,
							marginHorizontal: 8,
							backgroundColor: theme.PRIMARY_BUTTON_COLOR,
							opacity,
						}}
					/>
				);
			})}
		</View>
	);
};

export default Paginator;
