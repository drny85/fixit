import React, { FC } from 'react';
import { CheckBox } from 'react-native-elements';
import { FONTS, SIZES } from '../constants';
import { Theme } from '../types';

interface Props {
	theme: Theme;
	title: string;
	checked: boolean;
	onPress: () => void;
}

const CheckBoxItem: FC<Props> = ({ theme, checked, title, onPress }) => {
	return (
		<CheckBox
			textStyle={{
				...FONTS.body3,
				textTransform: 'capitalize',
				color: theme.mode === 'light' ? '#212121' : '#ffffff',
			}}
			containerStyle={{
				borderRadius: 15,
				backgroundColor: theme.BACKGROUND_COLOR,
				width: SIZES.width * 0.8,
				maxWidth: SIZES.isSmallDevice ? SIZES.width * 0.8 : SIZES.width * 0.5,
				alignSelf: 'center',
			}}
			checkedColor={theme.PRIMARY_BUTTON_COLOR}
			checkedIcon='dot-circle-o'
			uncheckedIcon='circle-o'
			title={title}
			checked={checked}
			onPress={onPress}
		/>
	);
};

export default CheckBoxItem;
