import React, { FC, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { Button, Divider, Screen, Text } from '../../../components';
import useNotifications from '../../../hooks/useNotifications';
import { useAppSelector } from '../../../redux/store';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ContractorNavigationRootParams } from '../../../types';
import styled from 'styled-components/native';
import { CheckBox } from 'react-native-elements';
import { FONTS, SIZES } from '../../../constants';

import SmallCard from '../../../components/SmallCard';
import useRequests from '../../../hooks/useRequests';
import { Request } from '../../../redux/requestReducer/requestActions';

type Props = NativeStackScreenProps<
	ContractorNavigationRootParams,
	'ContractorHomeStack'
>;

const ContractorHome: FC<Props> = ({ navigation }) => {
	useNotifications();
	const scrollRef = useRef<any>();
	const theme = useAppSelector((state) => state.theme);
	const { user } = useAppSelector((state) => state.auth);
	const [processing, setProcessing] = useState<boolean>(false);
	const [agreed, setAgreed] = useState<boolean>(false);
	const { requests } = useRequests();

	const handleActivateAccount = async () => {
		try {
			setProcessing(true);
			scrollRef.current;
			navigation.navigate('ContractorHomeStack', {
				screen: 'ConnectedAccountScreen',
			});
		} catch (error) {
			console.log(error);
		} finally {
			setProcessing(false);
		}
	};

	const requestCount = (status: Request['status']) => {
		return requests.filter((r) => r.status === status).length.toString();
	};

	return (
		<Screen center>
			{!user?.connectedAccountId && (
				<ScrollView ref={scrollRef} style={{ flex: 1, padding: 10 }}>
					<Text animation='fadeInDown' duration={400} center title>
						Congratulations!
					</Text>
					<Text animation='fadeInLeft' delay={400}>
						Your account has been activated but you must provide some personal
						information in order for you to start receiving payments.
					</Text>
					<Divider />
					<Text animation='fadeInRight' delay={600}>
						Customers wont be able to request services from you unless they can
						pay you
					</Text>
					<Divider />

					<Text animation='fadeInUp' bold center>
						You will be redirected to a secure link. Please have ready the
						following information for the next step:
					</Text>
					<Divider />
					<RequirementView>
						<Dot />
						<Text>Bank Routing Number</Text>
					</RequirementView>
					<RequirementView>
						<Dot />
						<Text>Bank Account Number</Text>
					</RequirementView>
					<RequirementView>
						<Dot />
						<Text>Date of Birth</Text>
					</RequirementView>
					<RequirementView>
						<Dot />
						<Text>Social Security Number</Text>
					</RequirementView>
					<RequirementView>
						<Dot />
						<Text>Driver License or State ID </Text>
						<Text caption>-might be required</Text>
					</RequirementView>
					<View style={{ marginTop: 30, flexDirection: 'row' }}>
						<CheckBox
							containerStyle={{
								backgroundColor: theme.BACKGROUND_COLOR,
								borderColor: theme.BACKGROUND_COLOR,
							}}
							checked={agreed}
							title='I agree to provide information listed above'
							checkedColor={theme.PRIMARY_BUTTON_COLOR}
							onPress={() => {
								agreed &&
									scrollRef.current.scrollToEnd(null, { animated: true });
								setAgreed((pre) => !pre);
							}}
							textStyle={{ ...FONTS.body3, color: theme.TEXT_COLOR }}
						/>
					</View>
					{agreed && (
						<View style={{ marginVertical: 30 }}>
							<Button disabled={processing} onPress={handleActivateAccount}>
								<Text bold center>
									Activate Account
								</Text>
							</Button>
						</View>
					)}
				</ScrollView>
			)}
			{user?.connectedAccountId && (
				<ScrollView style={{ flex: 1 }}>
					<Text bold center>
						Requests
					</Text>
					<View style={{ flexDirection: 'row', width: SIZES.width }}>
						<SmallCard
							title='New'
							subtitle={requestCount('pending')}
							onPress={() => {
								navigation.navigate('ContractorRequestStack', {
									screen: 'ContractorResquestsScreen',
									params: { requestsStatus: 'pending' },
								});
							}}
						/>

						<SmallCard
							title='Waiting Payment'
							subtitle={requestCount('waiting for payment')}
							onPress={() => {
								navigation.navigate('ContractorRequestStack', {
									screen: 'ContractorResquestsScreen',
									params: { requestsStatus: 'waiting for payment' },
								});
							}}
						/>
					</View>
					<View style={{ flexDirection: 'row', width: SIZES.width }}>
						<SmallCard
							title='In Progress'
							subtitle={requestCount('working on')}
							onPress={() => {
								navigation.navigate('ContractorRequestStack', {
									screen: 'ContractorResquestsScreen',
									params: { requestsStatus: 'working on' },
								});
							}}
						/>

						<SmallCard
							title='Completed'
							subtitle={requestCount('completed')}
							onPress={() => {
								navigation.navigate('ContractorRequestStack', {
									screen: 'ContractorResquestsScreen',
									params: { requestsStatus: 'completed' },
								});
							}}
						/>
					</View>
				</ScrollView>
			)}
		</Screen>
	);
};

export default ContractorHome;

const RequirementView = styled.View`
	flex-direction: row;
	align-items: center;
	margin: 10px 1px;
`;
const Dot = styled.View`
	height: 10px;
	width: 10px;
	border-radius: 5px;
	background-color: ${({ theme }) => theme.TEXT_COLOR};
`;
