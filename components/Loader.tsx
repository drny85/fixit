import React from 'react';
import styled from 'styled-components/native';

import { Screen } from '.';
import { useAppSelector } from '../redux/store';

const Loader = () => {
	const theme = useAppSelector((state) => state.theme);
	return (
		<Screen center>
			<Indicator size='large' color={theme.PRIMARY_BUTTON_COLOR} />
		</Screen>
	);
};

export default Loader;

const Indicator = styled.ActivityIndicator``;
