import { FontAwesome } from '@expo/vector-icons';
import React, { FC, useState } from 'react';
import {
	ImageBackground,
	Modal,
	TouchableHighlight,
	TouchableWithoutFeedback,
	View,
} from 'react-native';
import { Image } from 'react-native-elements/dist/image/Image';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { Divider, Screen, Text } from '.';
import { SIZES } from '../constants';
import Layout from '../constants/Layout';
import { useAppSelector } from '../redux/store';

interface Props {
	images: string[];
	viewImage: boolean;
	selectedImage: string;
	setSelectedImage: (value: string) => void;
	setViewImage: (value: boolean) => void;
}

const ImagesContainer: FC<Props> = ({
	images,
	setSelectedImage,
	setViewImage,
	selectedImage,
	viewImage,
}) => {
	const theme = useAppSelector((state) => state.theme);
	const [resizeMode, setResizeMode] = useState<'contain' | 'cover'>('contain');
	return (
		<View>
			<ScrollView horizontal showsHorizontalScrollIndicator={false}>
				{images &&
					images.map((image, index) => (
						<TouchableOpacity
							onPress={() => {
								setSelectedImage(image);
								setViewImage(!viewImage);
							}}
							style={{
								height: Layout.isSmallDevice ? 150 : 300,
								width: SIZES.width / 2.8,
								marginHorizontal: 8,
							}}
							key={index.toString()}
						>
							<Image
								style={{
									resizeMode: 'cover',
									borderRadius: 20,
									height: '100%',
									width: '100%',
								}}
								source={{ uri: image }}
							/>
							<View
								style={{
									position: 'absolute',
									left: 10,
									bottom: 10,
									backgroundColor: '#fff',

									justifyContent: 'center',
									alignItems: 'center',
									borderRadius: 5,
								}}
							>
								<Text darkText bold>
									{(index + 1).toString()}
								</Text>
							</View>
						</TouchableOpacity>
					))}
			</ScrollView>
			<Modal visible={viewImage} animationType='slide'>
				<Screen>
					<TouchableHighlight
						underlayColor={theme.SECONDARY_BUTTON_COLOR}
						onPress={() => {
							setViewImage(!viewImage);
						}}
						style={{
							justifyContent: 'center',
							alignItems: 'center',
							height: 60,
							zIndex: 99,
							width: 60,
							borderRadius: 30,
							backgroundColor: theme.SECONDARY_BUTTON_COLOR,
							position: 'absolute',
							right: 50,
							top: SIZES.statusBarHeight + 10,
						}}
					>
						<FontAwesome name='close' size={26} />
					</TouchableHighlight>
					<TouchableWithoutFeedback
						onLongPress={() =>
							setResizeMode(resizeMode === 'contain' ? 'cover' : 'contain')
						}
					>
						<ImageBackground
							style={{ height: '100%', width: '100%' }}
							resizeMode={resizeMode}
							source={{ uri: selectedImage ? selectedImage : '' }}
						/>
					</TouchableWithoutFeedback>
				</Screen>
			</Modal>
		</View>
	);
};

export default ImagesContainer;
