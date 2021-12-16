import React, { FC } from 'react';
import {
	View,
	Text,
	TextInput,
	StyleProp,
	TextStyle,
	ViewStyle,
} from 'react-native';

import { COLORS, FONTS, SIZES } from '../constants';
import { useAppSelector } from '../redux/store';

interface Props {
	label?: string;
	ref?: any;
	placeholder: string;
	value: string;
	onChangeText: (value: string) => void;
	leftIcon?: React.ReactElement;
	rightIcon?: React.ReactElement | undefined;
	errorMessage?: string | React.ReactElement;
	contentStyle?: StyleProp<TextStyle>;
	keyboardType?: TextInput['props']['keyboardType'];
	maxLenght?: number;
	containerStyle?: ViewStyle;
	errorStyle?: StyleProp<TextStyle>;
	multiline?: boolean;
	secureTextEntry?: boolean;
	autoCapitalize?: TextInput['props']['autoCapitalize'];
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
			containerStyle,
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
					style={[
						{
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
						},
						containerStyle,
					]}
				>
					{leftIcon}
					<TextInput
						ref={ref as any}
						style={[
							{
								flex: 1,
								paddingHorizontal: 10,
								color: theme.mode === 'dark' ? '#ffffff' : '#212121',
								...FONTS.body3,
							},
							contentStyle,
						]}
						value={value}
						placeholderTextColor={COLORS.placeHolderTextColor}
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

export default InputField;
