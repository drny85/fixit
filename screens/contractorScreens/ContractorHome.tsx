import React, { FC } from 'react';
import { View } from 'react-native';
import { Screen, Text } from '../../components';
import useNotifications from '../../hooks/useNotifications';

const ContractorHome: FC = () => {
	useNotifications();
	return (
		<Screen center>
			<Text>Contractor Home LOL</Text>
		</Screen>
	);
};

export default ContractorHome;
