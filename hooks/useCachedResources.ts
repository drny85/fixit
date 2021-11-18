import { lightTheme } from './../Theme';
import { useAppDispatch } from './../redux/store';
import { FontAwesome } from '@expo/vector-icons';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';
import useColorScheme from './useColorScheme';
import { darkTheme } from '../Theme';
import { switchTheme } from '../redux/themeReducer/themeSlide';
import { auth } from '../firebase';
import { autoSignInUser, logout } from '../redux/authReducer/authActions';
import { setUserRole } from '../redux/authReducer/authSlider';

export default function useCachedResources() {
	const [isLoadingComplete, setLoadingComplete] = React.useState(false);
	const isDark = useColorScheme() === 'dark';
	const dispatch = useAppDispatch();

	const autoSignIn = async () => {
		try {
			auth.onAuthStateChanged((authState) => {
				if (authState?.uid) {
					if (authState.emailVerified) {
						authState.getIdTokenResult().then((res) => {
							const role = res.claims.role;
							console.log(role);
							if (role) {
								dispatch(setUserRole(role));
							} else {
								dispatch(setUserRole('contractor'));
							}
						});

						return dispatch(autoSignInUser(authState.uid));
					} else {
						//dispatch(logout());
					}
					//return dispatch(logout());
				}
			});
		} catch (error) {
			console.log(error);
		}
	};

	// Load any resources or data that we need prior to rendering the app
	React.useEffect(() => {
		async function loadResourcesAndDataAsync() {
			try {
				SplashScreen.preventAutoHideAsync();

				// Load fonts
				isDark
					? dispatch(switchTheme(darkTheme))
					: dispatch(switchTheme(lightTheme));
				await Font.loadAsync({
					...FontAwesome.font,
					montserrat: require('../assets/fonts/Montserrat-Regular.ttf'),
					'montserrat-bold': require('../assets/fonts/Montserrat-Bold.ttf'),
					italic: require('../assets/fonts/Montserrat-LightItalic.ttf'),
					tange: require('../assets/fonts/Tangerine-Regular.ttf'),
				});
				await autoSignIn();
			} catch (e) {
				// We might want to provide this error information to an error reporting service
				console.warn(e);
			} finally {
				setLoadingComplete(true);
				SplashScreen.hideAsync();
			}
		}

		loadResourcesAndDataAsync();
	}, [isDark]);

	return isLoadingComplete;
}
