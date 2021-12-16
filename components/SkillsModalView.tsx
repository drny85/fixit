import React, { FC, useEffect, useState } from 'react';
import {
	View,
	Modal,
	TouchableOpacity,
	FlatList,
	ListRenderItem,
} from 'react-native';
import { CheckBox } from 'react-native-elements';
import { Text } from '.';
import { FONTS, SIZES } from '../constants';
import { useAppSelector } from '../redux/store';
import styled from 'styled-components/native';
import { getServices } from '../redux/servicesReducer/servicesActions';
import { Service } from '../constants/Services';

interface Props {
	visible: boolean;
	onPress?: any;
	setVisible: any;
}

const SkillsModalView: FC<Props> = ({ visible, onPress, setVisible }) => {
	const theme = useAppSelector((state) => state.theme);
	const { services, servicesSelected } = useAppSelector(
		(state) => state.services
	);

	const checked = (s: Service) => {
		return servicesSelected.includes(s);
	};

	return (
		<Modal
			visible={visible}
			animationType='slide'
			style={{ backgroundColor: theme.BACKGROUND_COLOR, flex: 1 }}
		>
			<Overlay>
				<View
					style={{
						flex: 1,
						height: SIZES.isSmallDevice
							? SIZES.height * 0.8
							: SIZES.height * 0.6,
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
					<View
						style={{
							marginBottom: 20,
							alignItems: 'center',

							paddingVertical: 10,
						}}
					>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'space-between',
								width: SIZES.width * 0.8,
							}}
						>
							<Text capitalize center bold>
								Pick All That Apply to you
							</Text>
							<TouchableOpacity
								style={{
									paddingVertical: 2,
									paddingHorizontal: 4,
									borderWidth: 1,
									borderColor: theme.PRIMARY_BUTTON_COLOR,
									borderRadius: 15,
								}}
								onPress={() => setVisible(false)}
							>
								<Text title>Done</Text>
							</TouchableOpacity>
						</View>
					</View>

					<Text center>You have selected {servicesSelected.length} Jobs</Text>

					<FlatList<any>
						style={{
							flex: 1,
							marginTop: 20,
							alignSelf: 'center',
							marginBottom: 50,
						}}
						data={services}
						showsVerticalScrollIndicator={false}
						scrollEventThrottle={15}
						keyExtractor={(item) => item.id}
						renderItem={({ item: service }) => (
							<CheckBox
								textStyle={{
									...FONTS.body3,
									color: theme.mode === 'light' ? '#212121' : '#ffffff',
									textTransform: 'capitalize',
								}}
								containerStyle={{
									borderRadius: 15,
									backgroundColor: theme.BACKGROUND_COLOR,
									width: SIZES.width * 0.8,
									maxWidth: SIZES.isSmallDevice
										? SIZES.width * 1
										: SIZES.width * 0.5,
								}}
								checkedColor={theme.PRIMARY_BUTTON_COLOR}
								checkedIcon='dot-circle-o'
								uncheckedIcon='circle-o'
								title={service.name}
								key={service.id}
								checked={checked(service)}
								onPress={() => onPress(service)}
							/>
						)}
					/>
				</View>
			</Overlay>
		</Modal>
	);
};

export default SkillsModalView;

const Overlay = styled.View`
	flex: 1;
	background-color: rgba(14, 13, 13, 0.733);
`;
