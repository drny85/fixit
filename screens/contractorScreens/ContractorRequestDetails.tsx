import { NativeStackScreenProps } from '@react-navigation/native-stack';
import moment from 'moment';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import styled from 'styled-components/native';
import {
	Button,
	Divider,
	Header,
	InputField,
	PhoneCall,
	Screen,
	Text,
} from '../../components';
import CheckBoxItem from '../../components/CheckBoxItem';
import EmailLink from '../../components/EmailLink';
import ImagesContainer from '../../components/ImagesContainer';
import LogItem from '../../components/LogItem';
import { SIZES } from '../../constants';
import { Contractor } from '../../constants/Contractors';
import { STATUS } from '../../constants/DispositonStatus';
import {
	Request,
	updateRequest,
} from '../../redux/requestReducer/requestActions';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { Log, RequestStatus, RequestTabParamList } from '../../types';

type Props = NativeStackScreenProps<RequestTabParamList, 'RequestDetails'>;

const ContractorRequestDetails: FC<Props> = ({ navigation, route }) => {
	const dispatch = useAppDispatch();
	let rowRefs = new Map();
	const [saving, setSaving] = useState<boolean>(false);
	const [viewImage, setViewImage] = useState<boolean>(false);
	const [showLogModal, setShowLogModal] = useState<boolean>(false);
	const [showEditModal, setShowEditModal] = useState<boolean>(false);
	const [selectedImage, setSelectedImage] = useState<string>('');
	const { user } = useAppSelector((state) => state.auth);
	const { request } = useAppSelector((state) => state.requests);
	const theme = useAppSelector((state) => state.theme);
	const [log, setLog] = useState<string>('');
	const [status, setStatus] = useState<RequestStatus>(undefined);

	const handleStatusChange = async () => {
		try {
			if (status !== undefined) {
				const data = { ...request };
				data.status = status;
				dispatch(updateRequest(data as Request));
				setShowEditModal(false);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleAddLog = useCallback(async () => {
		try {
			if (log === '') return;
			const logToSave: Log = {
				loggedOn: new Date().toISOString(),
				body: log,
				requestId: request?.id!,
			};

			const requestCopy = { ...request };

			requestCopy.logs && requestCopy.logs.length > 0
				? (requestCopy.logs = [logToSave, ...requestCopy.logs])
				: (requestCopy.logs = [logToSave]);
			setSaving(true);

			dispatch(updateRequest(requestCopy as Request));
			setLog('');

			setShowLogModal(false);
		} catch (error) {
			console.log(error);
		} finally {
			setSaving(false);
		}
	}, [dispatch, log]);

	const handleDeleteLog = useCallback(
		async (log: Log) => {
			try {
				console.log(log);
				const requestCopy = { ...request };

				const data =
					requestCopy.logs &&
					requestCopy.logs?.filter(
						(l) => l.loggedOn !== log.loggedOn && log.body !== l.body
					);
				requestCopy.logs = data;
				setSaving(true);

				dispatch(updateRequest(requestCopy as Request));
				setLog('');

				setShowLogModal(false);
			} catch (error) {
				console.log(error);
			} finally {
				setSaving(false);
			}
		},
		[dispatch, log]
	);

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
				<Text>Address: {request?.customer?.address}</Text>
			</View>
		);
	};

	const renderLogModal = (): JSX.Element => (
		<LogModal
			visible={showLogModal}
			animationType='slide'
			presentationStyle='overFullScreen'
		>
			<Overlay>
				<LogModalContainer style={{ width: SIZES.width }}>
					<Header
						title='Enter Log'
						onPressRight={() => setShowLogModal(false)}
						iconName='close'
					/>
					<View style={{ width: SIZES.width }}>
						<InputField
							multiline
							contentStyle={{ minHeight: SIZES.height * 0.2 }}
							placeholder='Type a brief description about the progress of this request'
							value={log}
							onChangeText={setLog}
						/>
					</View>
					<Button onPress={handleAddLog}>
						<Text> {saving ? 'Saving...' : 'Save Log'}</Text>
					</Button>
				</LogModalContainer>
			</Overlay>
		</LogModal>
	);
	const renderEditModal = (): JSX.Element => (
		<EditModal
			visible={showEditModal}
			animationType='slide'
			presentationStyle='overFullScreen'
		>
			<Overlay>
				<EditModalContainer style={{ width: SIZES.width }}>
					<Header
						title='Edit Request'
						onPressRight={() => setShowEditModal(false)}
						iconName='close'
					/>
					<View style={{ width: SIZES.width }}>
						<Divider />
						<Text center bold>
							Change Request Status
						</Text>
						<View>
							{STATUS.map((s) => (
								<CheckBoxItem
									title={s!}
									checked={s === status?.toLowerCase()}
									onPress={() => setStatus(s)}
									theme={theme}
								/>
							))}
						</View>
					</View>
					<View style={{ position: 'absolute', bottom: 50 }}>
						<Button onPress={handleStatusChange}>
							<Text bold>Save Changes</Text>
						</Button>
					</View>
				</EditModalContainer>
			</Overlay>
		</EditModal>
	);

	useEffect(() => {
		setStatus(request?.status!);
	}, [request?.status]);

	return (
		<Screen>
			<Header
				canGoBack
				title={`Request for ${request!.service?.name}`}
				onPressRight={() => setShowEditModal(true)}
				iconName='edit'
			/>
			<ViewContainer showsVerticalScrollIndicator={false}>
				<View
					style={{
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
				<Divider large />
				<LogsContainer>
					<Header
						title={`Job Logs (${request?.logs?.length})`}
						onPressRight={() => setShowLogModal(true)}
						iconName='plus-square'
					/>
					<LogsView
						showsVerticalScrollIndicator={false}
						style={{ height: 300 }}
					>
						{request?.logs &&
							request.logs.length > 0 &&
							request.logs.map((l, index) => (
								<LogItem
									ref={(ref: any) => {
										if (ref && !rowRefs.get(l.loggedOn)) {
											rowRefs.set(l.loggedOn, ref);
										}
									}}
									theme={theme}
									key={index.toString()}
									log={l}
									onDelete={() => handleDeleteLog(l)}
									onSwipeableWillOpen={() => {
										[...rowRefs.entries()].forEach(([key, ref]) => {
											if (key !== l.loggedOn && ref) ref.close();
										});
									}}
								/>
							))}
					</LogsView>
				</LogsContainer>
			</ViewContainer>
			{renderLogModal()}
			{renderEditModal()}
		</Screen>
	);
};

export default ContractorRequestDetails;

const ViewContainer = styled.ScrollView``;

const LogsView = styled.ScrollView``;
const LogsContainer = styled.View`
	padding: 2px 10px;
`;

const LogModal = styled.Modal`
	flex: 1;
	width: 100%;
	background-color: ${({ theme }) => theme.BACKGROUND_COLOR};
`;

const EditModal = styled.Modal`
	flex: 1;
	width: 100%;
	background-color: ${({ theme }) => theme.BACKGROUND_COLOR};
`;

const Overlay = styled.View`
	flex: 1;
	background-color: rgba(14, 13, 13, 0.733);
`;

const LogModalContainer = styled.View`
	align-items: center;
	position: absolute;
	flex: 1;
	top: 100px;
	border-top-left-radius: 35px;
	border-top-right-radius: 35px;
	background-color: ${({ theme }) => theme.BACKGROUND_COLOR};
	padding: 20px;
	left: 0;
	right: 0;
	bottom: 0;
`;

const EditModalContainer = styled.View`
	align-items: center;
	position: absolute;
	flex: 1;
	top: 100px;
	border-top-left-radius: 35px;
	border-top-right-radius: 35px;
	background-color: ${({ theme }) => theme.BACKGROUND_COLOR};
	padding: 20px;
	left: 0;
	right: 0;
	bottom: 0;
`;
