import { FontAwesome } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { FC, useEffect, useState } from 'react';
import { ListRenderItem, View, FlatList } from 'react-native';
import { Avatar, Rating } from 'react-native-elements';
import styled from 'styled-components/native';
import { Divider, PhoneCall, Screen, Text } from '../../../components';
import { statusBarHeight } from '../../../constants/Layout';
import { Review } from '../../../constants/Contractors';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { HomeTabParamList } from '../../../types';
import moment from 'moment';
import { db } from '../../../firebase';

import { getReviewsByContractor } from '../../../redux/reviewsRedu/reviewsAction';
import { login } from '../../../redux/authReducer/authActions';
import { SIZES } from '../../../constants';
import { getReviews } from '../../../redux/reviewsRedu/reviewsSlide';
import { DocumentReference } from '@google-cloud/firestore';

type Props = NativeStackScreenProps<HomeTabParamList, 'ContractorScreen'>;

const ContractorScreen: FC<Props> = ({ route, navigation }) => {
	const theme = useAppSelector((state) => state.theme);
	const { requests } = useAppSelector((state) => state.requests);
	const { user } = useAppSelector((state) => state.auth);
	const { contractor } = route.params;
	const dispatch = useAppDispatch();
	const { reviews, loading } = useAppSelector((state) => state.reviews);

	const onFinishRating = (rating: number) => {};

	const calculatePreviewServicesCount = (): number => {
		if (requests.length > 0) {
			return requests.filter((r) => r.contractor?.id === contractor.id).length;
		}
		return 0;
	};

	const currentRating = () => {
		return (
			reviews.reduce((acc, curr) => curr.rating + acc, 0) / reviews.length
		).toFixed(1);
	};

	useEffect(() => {
		const sub = db
			.collection('reviews')
			.doc(contractor.id)
			.collection('reviews')
			.onSnapshot((snapshot) => {
				dispatch(
					getReviews(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })))
				);
			});

		return sub;
	}, [dispatch, contractor.id]);

	const renderReviewsItem: ListRenderItem<Review> = ({ item, index }) => {
		return (
			<ReviewItem key={index.toString()}>
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>
					<Text bold capitalize>
						{item.reviewer.userId === user?.id
							? 'Me'
							: item.showName
							? item.reviewer.name
							: 'anonymous'}
					</Text>
					<Text caption capitalize>
						Recommended{' '}
						{item.recommend ? (
							<FontAwesome name='thumbs-up' size={18} />
						) : (
							<FontAwesome name='thumbs-down' size={18} />
						)}
					</Text>
				</View>
				<View>
					<Text caption>{item.body}</Text>
				</View>
				<View style={{ marginTop: 20 }}>
					<Text caption right>
						{moment(item.addedOn).format('lll')}
					</Text>
				</View>
			</ReviewItem>
		);
	};

	const renderSkillsView = (): React.ReactElement => {
		return (
			<>
				<View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
					<RequestServiceButton
						onPress={() =>
							navigation.navigate('RequestServiceScreen', { contractor })
						}
					>
						<Text title>Request Service</Text>
					</RequestServiceButton>
				</View>

				<Divider large />
				<SkillsView>
					<Text title>Skills / Services</Text>
					<View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
						{contractor.services.map((s, index) => (
							<Skill key={index.toString()}>
								<Text capitalize>{s.name}</Text>
							</Skill>
						))}
					</View>
				</SkillsView>
				<Divider large />
			</>
		);
	};

	const renderWorkerView = (): React.ReactElement => {
		return (
			<WorkerDetails>
				<ImageContainer>
					<Avatar
						source={{
							uri: contractor.imageUrl
								? contractor.imageUrl
								: 'https://www.mtsolar.us/wp-content/uploads/2020/04/avatar-placeholder-293x300.png',
						}}
						size='xlarge'
						rounded
					/>
				</ImageContainer>

				<View>
					<Text center title>
						{contractor.name}
					</Text>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<FontAwesome
							name='phone'
							style={{ marginRight: 8 }}
							size={20}
							color={theme.mode === 'dark' ? '#ffffff' : '#212121'}
						/>
						<PhoneCall phone={contractor.phone} />

						<View
							style={{
								justifyContent: 'center',
								flexDirection: 'row',
								alignItems: 'center',
								marginLeft: 20,
							}}
						>
							{/* {contractor.rating && (
								<>
									<Text center>Rating {contractor.rating}</Text>
									<FontAwesome
										name='star'
										size={18}
										color={theme.mode === 'dark' ? '#ffffff' : '#212121'}
									/>
								</>
							)} */}
							{reviews.length > 0 && (
								<>
									<Text center>Rating {currentRating()}</Text>
									<FontAwesome
										name='star'
										size={18}
										color={theme.mode === 'dark' ? '#ffffff' : '#212121'}
									/>
								</>
							)}
						</View>
					</View>
					<View
						style={{
							justifyContent: 'center',
							alignItems: 'center',
							flexDirection: 'row',
							marginTop: 4,
						}}
					>
						<FontAwesome
							name='envelope'
							size={18}
							style={{ marginRight: 8 }}
							color={theme.mode === 'dark' ? '#ffffff' : '#212121'}
						/>
						<Text center>{contractor.email}</Text>
					</View>
					{calculatePreviewServicesCount() > 0 && (
						<Text center caption>
							Previous Requests: {calculatePreviewServicesCount()}
						</Text>
					)}
				</View>
			</WorkerDetails>
		);
	};

	return (
		<Screen>
			<Header
				style={{ top: statusBarHeight }}
				onPress={() => navigation.goBack()}
			>
				<FontAwesome
					name='chevron-left'
					size={24}
					color={theme.mode === 'dark' ? '#ffffff' : '#212121'}
				/>
			</Header>

			<View style={{ flex: 1 }}>
				<FlatList
					showsVerticalScrollIndicator={false}
					ListHeaderComponent={
						<View style={{ flex: 1 }}>
							{renderWorkerView()}
							{renderSkillsView()}
							{reviews.length > 0 && (
								<Text style={{ paddingLeft: SIZES.padding * 0.5 }} caption>
									Reviews ({reviews.length})
								</Text>
							)}
						</View>
					}
					data={reviews}
					keyExtractor={(item) => item.id!}
					renderItem={renderReviewsItem}
				/>
			</View>
		</Screen>
	);
};

export default ContractorScreen;

const MainView = styled.ScrollView``;

const ImageContainer = styled.View`
	justify-content: center;
	align-items: center;
`;
const WorkerDetails = styled.View`
	padding: 10px;
`;

const RequestServiceButton = styled.TouchableOpacity`
	padding: 10px 20px;
	border-radius: 15px;
	background-color: ${({ theme }) => theme.PRIMARY_BUTTON_COLOR};
	align-self: center;
	max-width: 300px;
	justify-content: center;
	margin: 1px 5px;
	align-items: center;
`;
const SkillsView = styled.View`
	padding: 10px;
	flex-direction: row;
	align-items: center;
	align-self: center;
	flex-wrap: wrap;
`;

const Skill = styled.View`
	justify-content: center;
	align-items: center;

	margin: 5px;
	padding: 10px 15px;
	background-color: ${({ theme }) => theme.PRIMARY_BUTTON_COLOR};
	border-radius: 15px;
`;
const ReviewItem = styled.View`
	padding: 10px;
	border-radius: 15px;
	margin: 10px;
	background-color: ${({ theme }) => theme.SECONDARY_BUTTON_COLOR};
`;

const Header = styled.TouchableOpacity`
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	padding: 10px;
	position: absolute;
	left: 5px;
	z-index: 999;
	width: 20%;
	margin-left: 10px;
`;
