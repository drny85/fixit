import * as Notifications from 'expo-notifications';
import { useEffect, useRef } from 'react';
import { Alert, Platform } from 'react-native';
import Constant from 'expo-constants';
import { useNavigation } from '@react-navigation/native';

import { db } from '../firebase';
import { useAppSelector } from '../redux/store';

Notifications.setNotificationHandler({
	handleNotification: async (notification) => {
		const { data } = notification.request.content;

		return {
			shouldShowAlert: true,
			shouldPlaySound: false,
			shouldSetBadge: false,
		};
	},
});

let pushToken = null;
const useNotifications = () => {
	const naviagtion = useNavigation<any>();

	const notificationListener = useRef<any>();
	const responseListener = useRef<any>();
	const { user } = useAppSelector((state) => state.auth);

	useEffect(() => {
		registerForPushNotificationsAsync();

		notificationListener.current =
			Notifications.addNotificationReceivedListener(
				(notification: Notifications.Notification) => {
					const { data } = notification.request.content;
				}
			);

		responseListener.current =
			Notifications.addNotificationResponseReceivedListener(
				(response: Notifications.NotificationResponse) => {
					const { content } = response.notification.request;
					const { data } = content;

					if (!data) return;
					console.log('Notification Data', data);
					if (
						data.notificationType === 'new_signup' &&
						user?.role === 'admin'
					) {
						naviagtion.navigate('ContractorsDashboard', {
							userId: data.userId,
						});
					} else if (
						data.notificationType === 'new_request' &&
						user?.role === 'consumer'
					) {
						naviagtion.navigate('OrdersStack');
					}
				}
			);

		return () => {
			Notifications.removeNotificationSubscription(
				notificationListener.current
			);
			Notifications.removeNotificationSubscription(responseListener.current);
		};
	}, []);

	const registerForPushNotificationsAsync = async () => {
		try {
			if (Constant.isDevice) {
				const { status: existingStatus } =
					await Notifications.requestPermissionsAsync();
				let finalStatus = existingStatus;
				if (existingStatus !== 'granted') {
					const { status } = await Notifications.getPermissionsAsync();
					finalStatus = status;
				}

				if (finalStatus !== 'granted') {
					Alert.alert(
						'Error',
						'Failed to get push token for push notification!',
						[{ text: 'OK', style: 'cancel' }]
					);
					return;
				}
				const token = (await Notifications.getExpoPushTokenAsync()).data;

				const signedUser = await db.collection('users').doc(user?.id).get();
				const alreadySigned = signedUser.data()?.pushToken;

				if (alreadySigned) return;
				await db
					.collection('users')
					.doc(user?.id)
					.set({ pushToken: token }, { merge: true });
			}

			if (Platform.OS === 'android') {
				Notifications.setNotificationChannelAsync('default', {
					name: 'default',
					importance: Notifications.AndroidImportance.MAX,
					vibrationPattern: [0, 250, 250, 250],
					lightColor: '#FF231F7C',
				});
			}
		} catch (error) {
			console.log('Error from useNotifications hooks', error);
		}
	};
};

export default useNotifications;
