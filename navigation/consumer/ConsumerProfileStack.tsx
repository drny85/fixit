import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ConsumerProfileStackParams } from '../../types';
import { SettingsScreen } from '../../screens';

const { Navigator, Screen } =
	createNativeStackNavigator<ConsumerProfileStackParams>();

const ConsumerProfileStack: FC = () => {
	return (
		<Navigator>
			<Screen
				name='ConsumerProfile'
				component={SettingsScreen}
				options={{ headerShown: false }}
			/>
		</Navigator>
	);
};

export default ConsumerProfileStack;
