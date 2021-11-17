import { FontAwesome } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AnimatedLottieView from 'lottie-react-native';
import React, { FC, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { View, Animated } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Button, Loader, Paginator, Text } from '../../components';
import { DataProps } from '../../components/Paginator';
import { SIZES } from '../../constants';
import Layout from '../../constants/Layout';
import { data } from '../../constants/OnBoardingData';
import { useAppSelector } from '../../redux/store';
import { AuthTabParamList } from '../../types';
import { hasSignInBefore } from '../../utils/hasSignedInBefore';

type Props = NativeStackScreenProps<AuthTabParamList, 'OnBoardingScreen'>;

const OnBoardingScreen: FC<Props> = ({ navigation }) => {
	const [canContinue, setCanContinue] = useState<boolean>(false);
	const [currentX, setCurrentX] = useState<number>(0);
	const theme = useAppSelector((state) => state.theme);
	const { user } = useAppSelector((state) => state.auth);
	const scrollX = useRef(new Animated.Value(0)).current;
	const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 75 }).current;
	const slideRef = useRef<any>();
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		(async () => {
			try {
				const isSigned = await hasSignInBefore();

				if (isSigned) {
					setLoading(false);
					navigation.replace('LoginScreen');
				}
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	const viewableItemsChanged = useRef(({ viewableItems }: any) => {
		if (viewableItems.length > 0) {
			setCurrentX(viewableItems[0].index);
		}
	}).current;

	const _nextStep = () => {
		if (currentX < data.length - 1) {
			slideRef.current.scrollToIndex({ index: currentX + 1 });
			setCanContinue(false);
		}
	};

	const _prevStep = () => {
		if (currentX !== 0) {
			slideRef.current.scrollToIndex({ index: currentX - 1 });
		}
	};

	const renderStepView = (index: number, item: DataProps) => {
		return (
			<View
				style={{
					padding: 15,
					flex: 1,
					maxWidth: !Layout.isSmallDevice ? SIZES.width * 0.7 : SIZES.width,
					alignSelf: Layout.isSmallDevice ? 'auto' : 'center',
				}}
			>
				<Text tange xlarge center animation='fadeInDown'>
					{item.title}
				</Text>
				<View style={{ marginTop: 30 }}>
					<Text
						animation='fadeInUpBig'
						duration={1000}
						delay={500}
						style={{ lineHeight: 26 }}
					>
						{item.subtitle}
					</Text>
				</View>
				<View
					style={{
						flex: 1,

						justifyContent: 'center',
						alignItems: 'center',
						marginBottom: 15,
					}}
				>
					<AnimatedLottieView
						style={{ flex: 1 }}
						resizeMode='contain'
						autoPlay
						loop
						source={item.imageUrl}
					/>
				</View>
			</View>
		);
	};

	if (loading) return <Loader />;

	return (
		<View
			style={{
				flex: 1,
				backgroundColor: theme.BACKGROUND_COLOR,
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<Animated.FlatList
				ref={slideRef}
				keyboardShouldPersistTaps={'handled'}
				showsHorizontalScrollIndicator={false}
				pagingEnabled
				contentContainerStyle={{ marginTop: 40 }}
				scrollEnabled={canContinue}
				horizontal
				viewabilityConfig={viewConfig}
				onViewableItemsChanged={viewableItemsChanged}
				bounces={false}
				scrollEventThrottle={32}
				onScroll={Animated.event(
					[{ nativeEvent: { contentOffset: { x: scrollX } } }],
					{ useNativeDriver: false }
				)}
				data={data}
				keyExtractor={(item) => item.id}
				renderItem={({ item, index }) => {
					return (
						<View
							style={{
								width: SIZES.width,
								height: '100%',
							}}
						>
							<View style={{ flex: 1 }}>{renderStepView(index, item)}</View>
						</View>
					);
				}}
			/>
			<View
				style={{
					height: '20%',
					width: '100%',
					marginBottom: 20,
					maxWidth: !Layout.isSmallDevice ? SIZES.width * 0.7 : SIZES.width,
					alignSelf: Layout.isSmallDevice ? 'auto' : 'center',
				}}
			>
				<View style={{ alignSelf: 'center', marginVertical: 15 }}>
					<Paginator data={data} scrollX={scrollX} theme={theme} />
				</View>
				{currentX === data.length - 1 && (
					<Text center bold>
						Sign Up As?
					</Text>
				)}
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignSelf: 'center',
						marginHorizontal: 25,
						marginTop: 20,
					}}
				>
					{currentX > 0 && currentX !== data.length - 1 ? (
						<TouchableOpacity
							style={{
								flexDirection: 'row',
								justifyContent: 'center',
								alignItems: 'center',
							}}
							onPress={_prevStep}
						>
							<FontAwesome
								name='chevron-left'
								size={26}
								color={theme.PRIMARY_BUTTON_COLOR}
							/>
							<Text style={{ marginLeft: 8 }} bold>
								Prev
							</Text>
						</TouchableOpacity>
					) : currentX === data.length - 1 ? (
						<Button onPress={() => navigation.replace('SignUpAsContractor')}>
							<Text lightText bold>
								Contractor
							</Text>
						</Button>
					) : (
						<Text></Text>
					)}

					{currentX !== data.length - 1 ? (
						<TouchableOpacity
							style={{
								flexDirection: 'row',
								justifyContent: 'center',
								alignItems: 'center',
							}}
							onPress={_nextStep}
						>
							<Text style={{ marginRight: 8 }} bold>
								Next
							</Text>
							<FontAwesome
								name='chevron-right'
								size={26}
								color={theme.PRIMARY_BUTTON_COLOR}
							/>
						</TouchableOpacity>
					) : (
						<Button onPress={() => navigation.replace('SignUpScreen')}>
							<Text lightText bold>
								Consumer
							</Text>
						</Button>
					)}
				</View>
			</View>
		</View>
	);
};

export default OnBoardingScreen;
