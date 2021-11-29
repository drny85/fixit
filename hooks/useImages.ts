import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';

export const useImages = () => {
	const [images, setImages] = useState<any[]>([]);

	useEffect(() => {
		(async () => {
			if (Platform.OS !== 'web') {
				const { status } =
					await ImagePicker.requestMediaLibraryPermissionsAsync();
				if (status !== 'granted') {
					Alert.alert(
						'Error',
						'Sorry, we need camera roll permissions to make this work!',
						[{ text: 'OK', style: 'cancel' }]
					);
				}
			}
		})();
	}, []);

	const pickImages = async () => {
		try {
			let result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				allowsEditing: true,
				aspect: [4, 3],
				quality: 0.5,
			});

			if (!result.cancelled) {
				setImages([...images, result.uri]);
			}
		} catch (error) {
			console.log(error);
		}
	};

	return { images, pickImages };
};
