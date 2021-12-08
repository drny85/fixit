import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC } from 'react';
import { View } from 'react-native';
import { Button, Header, Screen, Text } from '../../components';
import { functions } from '../../firebase';
import { useAppSelector } from '../../redux/store';
import { AdminTabParamList } from '../../types';

type Props = NativeStackScreenProps<
	AdminTabParamList,
	'AdminContractorDetails'
>;

const AdminContractorDetails: FC<Props> = ({ route }) => {
	const { users } = useAppSelector((state) => state.auth);

	const contrator = users.find((u) => u.id === route.params.contratorId);

	const makeUserAContractor = async () => {
		try {
			const funcRef = functions.httpsCallable('makeUserAContractor');
			if (!contrator?.email) return;
			const { data } = await funcRef({ email: contrator?.email });
			console.log(data);
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<Screen>
			<Header title='Contractor Details' canGoBack />
			<Button onPress={makeUserAContractor}>
				<Text center>Activate User</Text>
			</Button>
		</Screen>
	);
};

export default AdminContractorDetails;
