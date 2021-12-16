import React, { FC } from 'react';
import { View } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import { Text } from '.';
import { COLORS, FONTS, SIZES } from '../constants';
import { useAppSelector } from '../redux/store';

interface Props {
	label: string;
	onPress: any;
	ref?: any;
	errorMessage?: React.ReactElement | null;
}

const GoogleAutoComplete: FC<Props> = React.forwardRef(
	({ label, onPress, errorMessage }, ref) => {
		const theme = useAppSelector((state) => state.theme);
		return (
			<View>
				<Text
					style={{
						textAlign: 'left',
						paddingLeft: SIZES.padding * 0.4,
						marginBottom: 4,
						color: theme.mode === 'dark' ? '#ffffff' : '#212121',
						...FONTS.body4,
					}}
				>
					{label}
				</Text>
				<GooglePlacesAutocomplete
					nearbyPlacesAPI='GooglePlacesSearch'
					keyboardShouldPersistTaps='handled'
					placeholder='Type your address'
					debounce={400}
					ref={ref as any}
					fetchDetails={true}
					minLength={2}
					listUnderlayColor={theme.PRIMARY_BUTTON_COLOR}
					query={{
						key: process.env.GOOGLE_API,
						language: 'en', // language of the results
						components: 'country:us',
					}}
					styles={{
						container: {
							flex: 0,
							paddingVertical: 4,
						},
						textInput: {
							color: theme.mode === 'dark' ? '#ffffff' : '#212121',
							backgroundColor: theme.SHADOW_COLOR,
							paddingHorizontal: 12,
							paddingVertical: 8,
							borderRadius: 10,
							marginHorizontal: 10,
							shadowOffset: { width: 6, height: 6 },
							shadowColor: theme.SHADOW_COLOR,
							shadowOpacity: 0.4,
							shadowRadius: 6,
							elevation: 6,
							...FONTS.body3,
						},
						textInputContainer: {
							backgroundColor: theme.mode === 'light' ? '#ffffff' : '#212121',
						},
						description: {
							color: theme.mode === 'light' ? '#212121' : '#ffffff',
						},
						listView: {
							borderRadius: 10,
							marginHorizontal: 4,
						},
						row: {
							backgroundColor: theme.mode === 'dark' ? '#212121' : '#ffffff',
						},
					}}
					enablePoweredByContainer={false}
					onPress={onPress}
					textInputProps={{
						//InputComp: InputField,
						placeholderTextColor: COLORS.placeHolderTextColor,
						leftIcon: { type: 'font-awesome', name: 'chevron-left' },
						errorStyle: { color: 'red' },
					}}
				/>
				{errorMessage && (
					<View style={{ paddingRight: SIZES.padding * 0.5 }}>
						<Text style={{ color: 'red' }} right>
							{errorMessage}
						</Text>
					</View>
				)}
			</View>
		);
	}
);

export default GoogleAutoComplete;
