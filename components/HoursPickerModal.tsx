import React, { FC } from 'react';
import { View, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { Divider, Header, Text } from '.';
import { FONTS, SIZES } from '../constants';
import { Hours } from '../constants/Hours';
import { useAppSelector } from '../redux/store';

interface Props {
	hoursPicker: boolean;
	selectedHours: string;
	setHoursPicker: any;
	setSelectedHours: any;
}

const HoursPickerModal: FC<Props> = ({
	hoursPicker,
	setHoursPicker,
	selectedHours,
	setSelectedHours,
}) => {
	const theme = useAppSelector((state) => state.theme);
	return (
		<Modal visible={hoursPicker} animationType='slide' transparent>
			<View
				style={{
					flex: 1,
					height: SIZES.isSmallDevice ? SIZES.height * 0.8 : SIZES.height * 0.6,
					position: 'absolute',
					bottom: 0,
					left: 0,
					right: 0,
					backgroundColor: theme.BACKGROUND_COLOR,
					borderTopLeftRadius: 35,
					borderTopRightRadius: 35,
					borderColor: theme.ASCENT,
					borderWidth: 2,
				}}
			>
				<View style={{ position: 'absolute', right: 30, top: 30, zIndex: 99 }}>
					<TouchableOpacity onPress={() => setHoursPicker(false)}>
						<Text bold>Done</Text>
					</TouchableOpacity>
				</View>
				<ScrollView contentContainerStyle={{ padding: 20, marginTop: 50 }}>
					<View>
						<Text center bold>
							Pick a Time
						</Text>
					</View>
					<Divider />
					{Hours.map((hour) => {
						return (
							<CheckBox
								textStyle={{
									...FONTS.body3,
									color: theme.mode === 'light' ? '#212121' : '#ffffff',
								}}
								containerStyle={{
									borderRadius: 15,
									backgroundColor: theme.BACKGROUND_COLOR,
									width: SIZES.width * 0.8,
									maxWidth: SIZES.isSmallDevice
										? SIZES.width * 0.8
										: SIZES.width * 0.5,
									alignSelf: 'center',
								}}
								checkedColor={theme.PRIMARY_BUTTON_COLOR}
								checkedIcon='dot-circle-o'
								uncheckedIcon='circle-o'
								title={hour.time}
								key={hour.time}
								checked={selectedHours === hour.time}
								onPress={() => setSelectedHours(hour.time)}
							/>
						);
					})}
				</ScrollView>
			</View>
		</Modal>
	);
};

export default HoursPickerModal;
