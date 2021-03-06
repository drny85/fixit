import { NativeStackScreenProps } from '@react-navigation/native-stack';
import moment from 'moment';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Alert, TouchableWithoutFeedback, View } from 'react-native';
import styled from 'styled-components/native';
import dayjs from 'dayjs';
import local from 'dayjs/plugin/localizedFormat';
dayjs().format();
dayjs.extend(local);

import {
	Button,
	Divider,
	Header,
	Loader,
	PhoneCall,
	Screen,
	Text,
} from '../../../components';
import FloatingButton from '../../../components/FloatingButton';
import ImagesContainer from '../../../components/ImagesContainer';
import ReviewModal from '../../../components/ReviewModal';
import { SIZES } from '../../../constants';
import { Contractor, Review } from '../../../constants/Contractors';
import { db, functions } from '../../../firebase';

import { Request } from '../../../redux/requestReducer/requestActions';
import {
	addReview,
	getReviewsByContractor,
} from '../../../redux/reviewsReducer/reviewsAction';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { RequestTabParamList } from '../../../types';
import { setRequest } from '../../../redux/requestReducer/requestSlide';

type Props = NativeStackScreenProps<RequestTabParamList, 'RequestDetails'>;

const RequestDetails: FC<Props> = ({ navigation, route }) => {
	const { request: requestObject } = route.params;
	const dispatch = useAppDispatch();

	const [viewImage, setViewImage] = useState<boolean>(false);
	const [selectedImage, setSelectedImage] = useState<string>('');
	const [review, setReview] = useState<string>('');
	const { user, loading } = useAppSelector((state) => state.auth);
	const [visible, setVisible] = useState<boolean>(false);
	const [canContinue, setContinue] = useState<boolean>(false);
	const [rating, setRating] = useState<number>(1);
	const [recommended, setRecommended] = useState<boolean>(true);
	const [reviewed, setReviewed] = useState<boolean>(true);
	const [anonymous, setAnonymous] = useState<boolean>(true);
	const { reviews, loading: loadingReview } = useAppSelector(
		(state) => state.reviews
	);
	const { request } = useAppSelector((state) => state.requests);

	const onFinishRating = (rating: number) => {
		setRating(rating);
	};

	const alreadyReviewed = () => {
		const index = reviews.findIndex((s) => s.requestId === requestObject?.id);

		if (reviews.length === 0) return false;
		if (index === -1) return false;

		return true;
	};

	const submitReview = async () => {
		try {
			if (review.length < 3) {
				// @ts-ignore
				alert('Please type your review');
				return;
			} else if (rating === 1 && canContinue) {
				// @ts-ignore
				Alert.alert(
					'Your rating',
					`Are you sure you want to rate it just 1 start?`,
					[
						{ text: 'Change it', style: 'cancel' },
						{ text: `Yes, I'm sure`, onPress: () => setContinue(true) },
					]
				);
			}
			const reviewData: Review = {
				addedOn: new Date().toISOString(),
				body: review,
				reviewer: { name: user?.firstName!, userId: user?.id! },
				recommend: recommended!,
				showName: anonymous,
				contractorId: request?.contractor?.id!,
				rating,
				requestId: request?.id!,
			};

			if (alreadyReviewed()) {
				Alert.alert('Error', 'You already reviewed this job', [
					{ text: 'Ok', style: 'cancel' },
				]);
			}

			const added = await dispatch(addReview(reviewData));
			if (added) {
				setVisible(false);
				setReview('');
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		dispatch(getReviewsByContractor(requestObject?.contractor?.id!));
		setReviewed(alreadyReviewed());
		const sub = db
			.collection('requests')
			.doc(requestObject?.id)
			.onSnapshot(
				(snapshot) => {
					if (snapshot.exists) {
						dispatch(setRequest({ id: snapshot.id, ...snapshot.data() }));
					}
				},
				({ message }) => {
					console.log(message);
				}
			);

		return sub;
	}, [dispatch, reviewed]);

	const renderContractorInfo = (res: Request) => {
		return (
			<View>
				<Text center bold>
					Contractor
				</Text>
				<TouchableWithoutFeedback
					onPress={() =>
						navigation.navigate('ContractorScreen', {
							contractor: res.contractor as Contractor,
						})
					}
				>
					<Text bold>
						Full Name: {request?.contractor?.firstName}{' '}
						{request?.contractor?.lastName}
					</Text>
				</TouchableWithoutFeedback>

				<PhoneCall title='phone:' phone={request!.contractor!.phone} />

				<Text>
					Contractor: {request?.contractor?.firstName}{' '}
					{request?.contractor?.lastName}
				</Text>
			</View>
		);
	};

	const renderPaymentInfo = (res: Request) => {
		return (
			<View>
				<Divider large />
				<Text bold center>
					Payment Info
				</Text>
				<View>
					<Text>Paid: Yes</Text>
					<Text>Paid On: {moment(request?.paidOn).format('lll')}</Text>
					<Text bold>Amount: ${request?.amountPaid} </Text>
				</View>
			</View>
		);
	};

	if (!request) return <Loader />;

	return (
		<Screen>
			<Header canGoBack title={`Request for ${request?.service?.name}`} />
			<ViewContainer>
				<View
					style={{
						padding: SIZES.padding * 0.5,
					}}
				>
					<Text capitalize center large>
						Status: {request?.status}
					</Text>
					{user?.role === 'consumer' &&
						request?.status === 'completed' &&
						!reviewed && (
							<View
								style={{
									width: SIZES.isSmallDevice
										? SIZES.width * 0.8
										: SIZES.width * 0.5,
									alignSelf: 'center',
								}}
							>
								<Button
									onPress={() => {
										if (alreadyReviewed()) {
											// @ts-ignore
											alert('You already reviewed this job');
										} else {
											setVisible(true);
										}
									}}
								>
									<Text center bold>
										Write a Review
									</Text>
								</Button>
							</View>
						)}
					<Divider large />
					<Text capitalize>Contact Method: {request?.contactMethod}</Text>
					<Text>
						Service Request on: {moment(request?.receivedOn).format('llll')}
					</Text>
					<Text>
						Service Request for: {moment(request?.serviceDate).format('ll')}
					</Text>
					<Text>Time / Window: {request?.serviceTime}</Text>
					<Text>Address: {request?.serviceAddress}</Text>
					{request?.apt !== '' && <Text>Apt / Unit: {request?.apt}</Text>}

					{request.paid && renderPaymentInfo(request)}
					<Divider large />
					{renderContractorInfo(request!)}
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
			<ReviewModal
				recommended={recommended}
				anonymous={anonymous}
				setAnonymous={setAnonymous}
				setRecommended={setRecommended}
				visible={visible}
				setVisible={setVisible}
				review={review}
				onPress={submitReview}
				onFinishRating={onFinishRating}
				setComment={(text) => setReview(text)}
			/>
			{request?.status === 'waiting for payment' && !request.paid && (
				<View style={{ position: 'absolute', bottom: 0, right: 20 }}>
					<FloatingButton
						onPress={() =>
							navigation.navigate('PaymentBreakDown', { request: request })
						}
					/>
				</View>
			)}
		</Screen>
	);
};

export default RequestDetails;

const ViewContainer = styled.ScrollView``;
