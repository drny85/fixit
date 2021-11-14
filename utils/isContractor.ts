import { Request } from '../redux/requestReducer/requestActions';
import { useAppSelector } from '../redux/store';

export const isContractor = (request: Request) => {
	const { user } = useAppSelector((state) => state.auth);

	if (user?.id === request.contractor?.id) return true;
	return false;
};
