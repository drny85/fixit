import { ExpoConfig, ConfigContext } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
	return {
		name: 'IWillFixIt',
		slug: 'IWillFixIt',
		version: '1.0.0',
		orientation: 'portrait',
		icon: './assets/images/icon.png',
		scheme: 'myapp',
		userInterfaceStyle: 'automatic',
		splash: {
			image: './assets/images/splash.png',
			resizeMode: 'cover',
			backgroundColor: '#ffffff',
		},
		updates: {
			fallbackToCacheTimeout: 0,
		},
		assetBundlePatterns: ['**/*'],
		ios: {
			supportsTablet: true,
			buildNumber: '1.0.0',
			merchantId: 'net.robertdev.IwillFixIt',
			bundleIdentifier: 'net.robertdev.IwillFixIt',
			infoPlist: {
				NSCameraUsageDescription:
					'We need access to your camera so you can take pictures.',
				NSPhotoLibraryUsageDescription:
					'We need access to your photo library for you to select pictures',
				NSLocationWhenInUseUsageDescription:
					'We need your location to show you nearby contractor and services',
				NSLocationAlwaysUsageDescription:
					'We need your location to show you nearby contractors and services',
			},
		},
		android: {
			adaptiveIcon: {
				foregroundImage: './assets/images/adaptive-icon.png',
				backgroundColor: '#ffffff',
			},
			versionCode: 1,
			package: 'net.robertdev.IwillFixIt',
			useNextNotificationsApi: true,
		},
		web: {
			favicon: './assets/images/favicon.png',
		},
		extra: {
			apiKey: process.env.apiKey,
			authDomain: process.env.authDomain,
			projectId: process.env.projectId,
			storageBucket: process.env.storageBucket,
			messagingSenderId: process.env.messagingSenderId,
			appId: process.env.appId,
			measurementId: process.env.measurementId,
		},
		plugins: [
			[
				'expo-image-picker',
				{
					photosPermission:
						'The app accesses your photos to let you share them with your friends.',
				},
			],
		],
	};
};
