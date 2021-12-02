import React from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';

import { Screen } from '.';
import { useAppSelector } from '../redux/store';

const Loader = () => {
	const theme = useAppSelector((state) => state.theme);
	return (
		<Screen center>
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<Indicator size='large' color={theme.PRIMARY_BUTTON_COLOR} />
			</View>
		</Screen>
	);
};

export default Loader;

const Indicator = styled.ActivityIndicator``;
