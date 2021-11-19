import { FontAwesome } from '@expo/vector-icons';
import React, { FC, useState } from 'react';
import {
	View,
	Modal,
	TouchableOpacity,
	TouchableWithoutFeedback,
	Keyboard,
	Switch,
} from 'react-native';
import { Rating } from 'react-native-elements';
import styled from 'styled-components/native';

import { Button, InputField, Text } from '.';
import { FONTS, SIZES } from '../constants';
import { useAppSelector } from '../redux/store';

interface Props {
	visible: boolean;
	onPress?: any;
	setVisible: any;
	recommended: boolean | null;
	setRecommended: any;
	anonymous: boolean;
	setAnonymous: any;

	review: string;
	onFinishRating: (rating: number) => any;
	setComment: (value: string) => any;
}

const ReviewModal: FC<Props> = ({
	visible,
	onPress,
	setVisible,
	review,
	recommended,
	anonymous,
	setAnonymous,
	setRecommended,
	setComment,
	onFinishRating,
}) => {
	const theme = useAppSelector((state) => state.theme);

	return (
		<Modal
			visible={visible}
			animationType='slide'
			transparent
			style={{ backgroundColor: theme.PRIMARY_BUTTON_COLOR, flex: 1 }}
		>
			<TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
				<Overlay>
					<View
						style={{
							flex: 1,
							height: SIZES.isSmallDevice
								? SIZES.height * 0.8
								: SIZES.height * 0.6,
							position: 'absolute',
							bottom: 0,
							left: 0,
							right: 0,
							backgroundColor: theme.BACKGROUND_COLOR,
							borderTopLeftRadius: 35,
							borderTopRightRadius: 35,
							borderColor: theme.PRIMARY_BUTTON_COLOR,
							borderWidth: 2,
						}}
					>
						<View
							style={{
								marginBottom: 20,
								alignItems: 'center',
								paddingVertical: 10,
							}}
						>
							<View
								style={{
									flexDirection: 'row',
									alignItems: 'center',
									justifyContent: 'flex-end',
									width: SIZES.width * 0.8,
								}}
							>
								<TouchableOpacity
									style={{
										paddingVertical: 2,
										paddingHorizontal: 4,
										borderWidth: 1,
										borderColor: theme.PRIMARY_BUTTON_COLOR,
										borderRadius: 15,
									}}
									onPress={() => setVisible(false)}
								>
									<Text title>Cancel</Text>
								</TouchableOpacity>
							</View>
						</View>
						<View>
							<Rating
								string='#212121'
								type='custom'
								reviews={['very bad', 'bad', 'ok', 'sastified', 'outstanding']}
								ratingCount={5}
								count={5}
								defaultRating={5}
								startinValue={5}
								ratingBackgroundColor='#ffffff'
								ratingColor={theme.PRIMARY_BUTTON_COLOR}
								size={15}
								tintColor={theme.BACKGROUND_COLOR}
								showRating={true}
								minValue={1}
								onFinishRating={onFinishRating}
							/>
							<View>
								<View
									style={{
										flexDirection: 'row',
										alignItems: 'center',
										justifyContent: 'space-between',
										margin: SIZES.padding * 0.5,
									}}
								>
									<Text>Recommend this contractor?: </Text>
									<View
										style={{
											flexDirection: 'row',
											justifyContent: 'space-around',

											width: 80,
										}}
									>
										<TouchableOpacity onPress={() => setRecommended(true)}>
											<FontAwesome
												color={theme.mode === 'dark' ? '#ffffff' : '#212121'}
												name='thumbs-up'
												size={recommended ? 26 : 20}
											/>
										</TouchableOpacity>
										<TouchableOpacity onPress={() => setRecommended(false)}>
											<FontAwesome
												color={theme.mode === 'dark' ? '#ffffff' : '#212121'}
												name='thumbs-down'
												size={!recommended ? 26 : 20}
											/>
										</TouchableOpacity>
									</View>
								</View>
							</View>
							<View
								style={{
									flexDirection: 'row',
									alignItems: 'center',
									justifyContent: 'space-between',
									margin: SIZES.padding * 0.5,
								}}
							>
								<Text>Show my name?: </Text>
								<Switch
									value={anonymous}
									onValueChange={() => setAnonymous(!anonymous)}
								/>
							</View>
							<View>
								<InputField
									label='Review'
									value={review}
									multiline
									maxLenght={200}
									contentStyle={{ minHeight: SIZES.height * 0.2 }}
									onChangeText={setComment}
									errorMessage={<Text>{review.length} / 200</Text>}
									placeholder='Please tell us what you think about the job that was done'
								/>
							</View>
							<View style={{ marginTop: SIZES.padding }}>
								<Button
									onPress={onPress}
									style={{
										width: SIZES.isSmallDevice
											? SIZES.width * 0.7
											: SIZES.width * 0.5,
										alignSelf: 'center',
									}}
								>
									<Text center bold>
										Submit Review
									</Text>
								</Button>
							</View>
						</View>
					</View>
				</Overlay>
			</TouchableWithoutFeedback>
		</Modal>
	);
};

export default ReviewModal;

const Overlay = styled.View`
	flex: 1;
	background-color: rgba(14, 13, 13, 0.733);
`;
