import AsyncStorage from '@react-native-async-storage/async-storage';

export const hasSignInBefore = async (): Promise<boolean> => {
	try {
		const res = await AsyncStorage.getItem('hasSignedIn');
		if (res !== null) {
			return true;
		}

		return false;
	} catch (error) {
		console.log(error);
		return false;
	}
};
