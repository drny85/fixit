import { NativeStackScreenProps } from '@react-navigation/native-stack';
import moment from 'moment';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Alert, TouchableWithoutFeedback, View } from 'react-native';
import styled from 'styled-components/native';
import {
	Button,
	Divider,
	Header,
	PhoneCall,
	Screen,
	Text,
} from '../../components';
import EmailLink from '../../components/EmailLink';
import ImagesContainer from '../../components/ImagesContainer';
import ReviewModal from '../../components/ReviewModal';
import { SIZES } from '../../constants';
import { Contractor, Review } from '../../constants/Contractors';
import { statusBarHeight } from '../../constants/Layout';

import { Request } from '../../redux/requestReducer/requestActions';
import { email } from 'react-native-communications';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { RequestTabParamList } from '../../types';
import { isContractor } from '../../utils/isContractor';

type Props = NativeStackScreenProps<RequestTabParamList, 'RequestDetails'>;

const ContractorRequestDetails: FC<Props> = ({ navigation, route }) => {
	const { request } = route.params;
	const dispatch = useAppDispatch();
	const [viewImage, setViewImage] = useState<boolean>(false);
	const [selectedImage, setSelectedImage] = useState<string>('');
	const { user } = useAppSelector((state) => state.auth);

	useEffect(() => {}, []);

	const renderCustomerInfo = (res: Request) => {
		return (
			<View>
				<Text center bold>
					Customer / Client
				</Text>
				<TouchableWithoutFeedback
					onPress={() =>
						navigation.navigate('ContractorScreen', {
							contractor: res.contractor as Contractor,
						})
					}
				>
					<Text bold>Full Name: {request?.customer?.name}</Text>
				</TouchableWithoutFeedback>

				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<Text>Phone: </Text>
					<PhoneCall phone={request!.customer!.phone} />
				</View>
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<Text>Email: </Text>
					<EmailLink request={res} />
				</View>

				<Text capitalize>Contact Method: {request?.contactMethod}</Text>
			</View>
		);
	};

	return (
		<Screen>
			<Header
				canGoBack
				title={`Request for ${request!.service?.name}`}
				onPressRight={() => {}}
				iconName='edit'
			/>
			<ViewContainer>
				<View
					style={{
						marginTop: statusBarHeight + 20,
						padding: SIZES.padding * 0.5,
					}}
				>
					<Text capitalize center large>
						Status: {request?.status}
					</Text>

					<Divider large />

					<Text>
						Service Request on: {moment(request?.receivedOn).format('llll')}
					</Text>
					<Text>
						Service Request for: {moment(request?.serviceDate).format('ll')}
					</Text>
					<Text>Time / Window: {request?.serviceTime}</Text>
					<Divider large />
					{renderCustomerInfo(request!)}
					<Divider large />

					<Text bold>Images ({request?.images?.length})</Text>
					<ImagesContainer
						images={request!.images!}
						viewImage={viewImage}
						setViewImage={setViewImage}
						selectedImage={selectedImage}
						setSelectedImage={setSelectedImage}
					/>
					<Divider large />

					<Text bold center>
						Request Description
					</Text>
					<Text>{request?.description}</Text>
				</View>
			</ViewContainer>
		</Screen>
	);
};

export default ContractorRequestDetails;

const ViewContainer = styled.ScrollView``;
