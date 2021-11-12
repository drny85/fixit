import axios from 'axios';
import React, { FC } from 'react';
import { View } from 'react-native';
import styled from 'styled-components/native';
import { Button, Loader, Screen, Text } from '../../components';
import { functions } from '../../firebase';
import useContractors from '../../hooks/useContractors';

const Dashboard: FC = () => {
	const { users, loading } = useContractors();

	if (loading) return <Loader />;

	const makeUserAContractor = async () => {
		try {
			// const { data } = await axios.post(
			// 	'https://us-central1-fixit-e974a.cloudfunctions.net/makeUserAContractor',
			// 	{ data: { email: 'drny85@me.com' } }
			// );
			// if (data) {
			// 	console.log(data);
			// } else {
			// 	console.log('EZRR');
			// }
			const funcRef = functions.httpsCallable('makeUserAContractor');

			const res = await funcRef({ email: 'drny85@me.com' });
			console.log(await res.data);
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<Screen>
			<NewContractorView>
				<Text bold>New Congtractors {users.length}</Text>
			</NewContractorView>

			<Button onPress={makeUserAContractor}>
				<Text>Activate</Text>
			</Button>
		</Screen>
	);
};

export default Dashboard;

const NewContractorView = styled.View`
	padding: 15px;
	align-items: center;
	justify-content: center;
	background-color: ${({ theme }) => theme.PRIMARY_BUTTON_COLOR};
	margin: 5px 10px;
	border-radius: 15px;
`;
