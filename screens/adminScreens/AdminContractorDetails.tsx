import { NativeStackScreenProps } from '@react-navigation/native-stack';
import moment from 'moment';
import React, { FC } from 'react';
import { Alert, View } from 'react-native';
import { Switch } from 'react-native-elements';
import styled from 'styled-components/native';
import {
	Button,
	Divider,
	Header,
	PhoneCall,
	Screen,
	Text,
} from '../../components';
import { functions } from '../../firebase';
import { useAppSelector } from '../../redux/store';
import { ContractorsDashboardParams } from '../../types';

type Props = NativeStackScreenProps<
	ContractorsDashboardParams,
	'AdminContractorDetails'
>;

const AdminContractorDetails: FC<Props> = ({ route }) => {
	const { users } = useAppSelector((state) => state.auth);
	const theme = useAppSelector((state) => state.theme);
	const contrator = users.find((u) => u.id === route.params.contractorId);
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

	const makeContractorInactive = async () => {
		try {
			console.log('Implement functions to make user ianctive');
		} catch (error) {
			console.log(error);
		}
	};

	const confirmValueChange = () => {
		Alert.alert(
			'Status Change',
			contrator?.isActive
				? 'Are you sure you want to make this contractor inactive?'
				: 'Are you sure you want to active this contractor?',
			[
				{ text: 'No', style: 'cancel' },
				{
					text: 'Yes',
					onPress: contrator?.isActive
						? makeContractorInactive
						: makeUserAContractor,
				},
			]
		);
	};
	return (
		<Screen>
			<Header title='Contractor Details' canGoBack />
			{/* <Button onPress={makeUserAContractor}>
				<Text center>Activate User</Text>
			</Button> */}
			<Status
				style={{
					justifyContent: 'space-between',
					alignItems: 'center',
					flexDirection: 'row',
					marginHorizontal: 10,
				}}
			>
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<Text bold>Account: </Text>
					<ActiveStatusDot
						style={{
							backgroundColor: contrator?.connectedAccountId ? 'green' : 'red',
						}}
					/>
				</View>
				<View style={{ alignItems: 'center', flexDirection: 'row' }}>
					<Text title>Status </Text>
					<ActiveStatusDot
						style={{ backgroundColor: contrator?.isActive ? 'green' : 'red' }}
					/>
					<Switch
						style={{ marginLeft: 8 }}
						value={contrator?.isActive}
						onValueChange={confirmValueChange}
					/>
				</View>
			</Status>
			<Section>
				<Text center bold>
					Contact Info
				</Text>
				<Divider style={{ backgroundColor: 'grey' }} />
				<Text>Name: {contrator?.firstName}</Text>
				<Text>Last Name: {contrator?.lastName}</Text>
				<PhoneCall
					title='Phone'
					phone={contrator?.phone!}
					textStyle={{ color: '#668da3' }}
				/>
				<Text ellipsizeMode='tail' numberOfLines={1}>
					Email: {contrator?.email}
				</Text>
				<Text>Signed On: {moment(contrator?.addedOn).format('lll')}</Text>
				<Text>
					Activated On: {moment(contrator?.activatedOn).format('lll')}
				</Text>
			</Section>
			<Section>
				<Text center bold>
					Address / Business Address
				</Text>
				<Divider style={{ backgroundColor: 'grey' }} />
				<Text>{contrator?.address}</Text>
			</Section>
			<Section>
				<Text center bold>
					Skills of Jobs for this contractor
				</Text>
				<Divider style={{ backgroundColor: 'grey' }} />
				<SkillsView>
					{contrator?.services.map((s) => (
						<Skill key={s.id}>
							<Text>{s.name}</Text>
						</Skill>
					))}
				</SkillsView>
			</Section>
		</Screen>
	);
};

export default AdminContractorDetails;

const Section = styled.View`
	border-radius: 15px;
	background-color: ${({ theme }) => theme.SHADOW_COLOR};
	padding: 10px;
	margin: 8px;
`;

const Status = styled.View``;

const ActiveStatusDot = styled.View`
	height: 20px;
	width: 20px;
	border-radius: 10px;
`;

const Skill = styled.TouchableOpacity<{ center?: boolean }>`
	justify-content: center;
	align-items: center;
	max-width: 200px;
	margin: 5px;
	padding: 8px 15px;
	background-color: ${({ theme }) => theme.PRIMARY_BUTTON_COLOR};
	border-radius: 15px;
	${({ center }: any) => center && `align-self:center`}
`;

const SkillsView = styled.View`
	padding: 10px;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	flex-wrap: wrap;
`;
