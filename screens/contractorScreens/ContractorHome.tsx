import React, { FC, useEffect, useState } from 'react';
import { View } from 'react-native';
import { Button, Screen, Text } from '../../components';
import { functions } from '../../firebase';
import useNotifications from '../../hooks/useNotifications';
import { useAppSelector } from '../../redux/store';
import * as Linking from 'expo-linking';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeTabParamList } from '../../types';

type Props = NativeStackScreenProps<HomeTabParamList, 'ContractorScreen'>;

const ContractorHome: FC<Props> = ({ navigation }) => {
	useNotifications();

	const { user } = useAppSelector((state) => state.auth);
	const [processing, setProcessing] = useState<boolean>(false);

	const handleActivateAccount = async () => {
		try {
			navigation.navigate('ConnectedAccountScreen');
		} catch (error) {
			console.log(error);
		} finally {
		}
	};

	return (
		<Screen center>
			<Text>Contractor Home</Text>
			{!user?.connectedAccountId && (
				<Button disabled={processing} onPress={handleActivateAccount}>
					<Text>Activate Account</Text>
				</Button>
			)}
		</Screen>
	);
};

export default ContractorHome;
