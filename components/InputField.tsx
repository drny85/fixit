import React, { FC } from 'react';
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	StyleProp,
	TextStyle,
} from 'react-native';

import { FONTS, SIZES } from '../constants';
import { useAppSelector } from '../redux/store';

interface Props {
	label?: string;
	ref?: any;
	placeholder: string;
	value: string;
	onChangeText: (value: string) => void;
	leftIcon?: React.ReactElement;
	rightIcon?: React.ReactElement;
	errorMessage?: string | React.ReactElement;
	contentStyle?: any;
	keyboardType?: any;
	maxLenght?: number;
	errorStyle?: StyleProp<TextStyle>;
	multiline?: boolean;
	secureTextEntry?: boolean;
	autoCapitalize?: 'none' | 'words' | 'sentences';
}

const InputField: FC<Props> = React.forwardRef(
	(
		{
			label,
			placeholder,
			value,
			onChangeText,
			contentStyle,
			leftIcon,
			rightIcon,
			keyboardType,
			errorMessage,
			multiline,
			autoCapitalize,
			maxLenght,
			secureTextEntry,
			errorStyle,
		},
		ref
	) => {
		const theme = useAppSelector((state) => state.theme);

		return (
			<View>
				{/* LABEL */}
				<View>
					<Text
						style={{
							textAlign: 'left',
							paddingLeft: SIZES.padding * 0.5,
							marginBottom: 4,
							color: theme.mode === 'dark' ? '#ffffff' : '#212121',
							...FONTS.body4,
						}}
					>
						{label}
					</Text>
				</View>
				{/* INPUT */}
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						backgroundColor: theme.SHADOW_COLOR,
						paddingHorizontal: 8,
						paddingVertical: 14,
						borderRadius: 10,
						marginHorizontal: 10,
						shadowOffset: { width: 6, height: 6 },
						shadowColor: theme.SHADOW_COLOR,
						shadowOpacity: 0.4,
						shadowRadius: 6,
						elevation: 6,
					}}
				>
					{leftIcon}
					<TextInput
						ref={ref as any}
						style={{
							...contentStyle,
							flex: 1,
							paddingHorizontal: 10,
							color: theme.mode === 'dark' ? '#ffffff' : '#212121',
							...FONTS.body3,
						}}
						value={value}
						placeholderTextColor={theme.PRIMARY_BUTTON_COLOR}
						multiline={multiline}
						keyboardType={keyboardType}
						autoCorrect={false}
						maxLength={maxLenght}
						autoCompleteType='off'
						autoCapitalize={autoCapitalize || 'none'}
						secureTextEntry={secureTextEntry || false}
						placeholder={placeholder}
						onChangeText={onChangeText}
					/>
					{rightIcon}
				</View>
				{/* ERROR */}
				<View>
					<Text
						style={[
							{
								color: '#d16f6f',
								textAlign: 'right',
								marginRight: SIZES.padding,
								paddingTop: 5,
							},
							errorStyle,
						]}
					>
						{errorMessage}
					</Text>
				</View>
			</View>
		);
	}
);

const styles = StyleSheet.create({
	input: {
		borderRadius: 15,
		flexDirection: 'row',
		paddingVertical: 10,
		paddingHorizontal: 15,
		marginVertical: 5,
	},
});

export default InputField;
