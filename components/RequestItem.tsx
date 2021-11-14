import { FontAwesome } from '@expo/vector-icons';
import moment from 'moment';
import React, { FC } from 'react';
import styled from 'styled-components/native';
import { Divider, Text } from '.';
import { Request } from '../redux/requestReducer/requestActions';
import { useAppSelector } from '../redux/store';
import { isContractor } from '../utils/isContractor';

interface Props {
	request: Request;
	onPress: () => void;
}

const RequestItem: FC<Props> = ({ request, onPress }) => {
	const theme = useAppSelector((state) => state.theme);
	const { user } = useAppSelector((state) => state.auth);
	return (
		<RequestView
			style={{
				backgroundColor:
					request.status === 'completed'
						? theme.ASCENT
						: theme.PRIMARY_BUTTON_COLOR,
			}}
			onPress={onPress}
		>
			<Container>
				<Text numberOfLines={1} ellipsizeMode='tail' capitalize title center>
					Request for {request!.service?.name}
				</Text>
				<Divider style={{ backgroundColor: '#ffffff' }} large />
				<Text capitalize large>
					Status: {request.status}
				</Text>
				<Text>Job Date: {moment(request.serviceDate).format('ll')}</Text>
				<Text>Submitted on: {moment(request.receivedOn).format('lll')}</Text>
				<Text>
					{isContractor(request) ? 'Customer:' : 'Contractor'}{' '}
					{isContractor(request)
						? request.customer?.name
						: request.contractor?.name}
				</Text>
			</Container>
			<FontAwesome name='chevron-right' size={20} />
		</RequestView>
	);
};

export default RequestItem;

const RequestView = styled.TouchableOpacity`
	padding: 10px;
	margin: 5px 10px;
	border-radius: 10px;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	background-color: ${({ theme }) => theme.SECONDARY_BUTTON_COLOR};
`;

const Container = styled.View``;
