import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ConsumerMessageStackParams } from '../../types';

import MessageDetails from '../../screens/consumerScreens/messages/MessageDetails';
import { Messages } from '../../screens';

const { Navigator, Screen } =
	createNativeStackNavigator<ConsumerMessageStackParams>();

const ConsumerMessageStack: FC = () => {
	return (
		<Navigator>
			<Screen
				name='ConsumerMessageScreen'
				component={Messages}
				options={{ headerShown: false }}
			/>
			<Screen
				name='ConsumerMessageDetails'
				component={MessageDetails}
				options={{ headerShown: false }}
			/>
		</Navigator>
	);
};

export default ConsumerMessageStack;
