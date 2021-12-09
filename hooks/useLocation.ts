import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

const useLocation = () => {
	const [location, setLocation] = useState<Location.LocationGeocodedAddress>();
	const [errorMsg, setErrorMsg] = useState<any>();

	useEffect(() => {
		(async () => {
			try {
				let { status } = await Location.requestForegroundPermissionsAsync();
				if (status !== 'granted') {
					setErrorMsg('Permission to access location was denied');
					return;
				}
				let { coords } = await Location.getCurrentPositionAsync({});
				const { longitude, latitude } = coords;

				let address = await Location.reverseGeocodeAsync({
					longitude,
					latitude,
				});

				setLocation(address[0]);
			} catch (error) {
				console.log(error);
				setErrorMsg(error);
			}
		})();
	}, []);

	return { location, errorMsg };
};

export default useLocation;
