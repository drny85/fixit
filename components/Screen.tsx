import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from 'styled-components/native';
import { SIZES } from '../constants';
import { useAppSelector } from '../redux/store';

const Screen: React.FC<{ style?: ViewStyle; center?: boolean }> = ({
	children,
	style,
	center,
}) => {
	const theme = useAppSelector((state) => state.theme);
	return (
		<SafeAreaView
			style={[
				{
					backgroundColor: theme.BACKGROUND_COLOR,
					flex: 1,
					alignItems: center ? 'center' : undefined,
					justifyContent: center ? 'center' : undefined,
				},
				style,
			]}
		>
			<StatusBar style={theme.mode === 'dark' ? 'light' : 'auto'} />
			<View
				style={{
					alignItems: center ? 'center' : undefined,
					justifyContent: center ? 'center' : undefined,
					width: SIZES.width,
					maxWidth: SIZES.isSmallDevice ? SIZES.width : SIZES.width * 0.85,
					alignSelf: SIZES.isSmallDevice ? 'auto' : 'center',
					flex: 1,
				}}
			>
				{children}
			</View>
		</SafeAreaView>
	);
};

export default Screen;

const MainView = styled.View``;
