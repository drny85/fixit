import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { Request } from '../redux/requestReducer/requestActions';
import { getRequests } from '../redux/requestReducer/requestSlide';
import { useAppSelector, useAppDispatch } from '../redux/store';

export default function useRequests() {
	const dispatch = useAppDispatch();
	const { requests } = useAppSelector((state) => state.requests);
	const { user } = useAppSelector((state) => state.auth);
	const [loading, setLoading] = useState<boolean>(true);
	useEffect(() => {
		const sub = db
			.collection('requests')
			.where(
				user?.role === 'consumer' ? 'userId' : 'contractor.id',
				'==',
				user?.id
			)
			.orderBy('receivedOn', 'desc')
			.onSnapshot((snapshop) => {
				dispatch(
					getRequests(
						snapshop.docs
							.map((doc) => {
								return {
									id: doc.id,
									...doc.data(),
								} as Request;
							})
							.sort((a, b) =>
								a.serviceDate > b.serviceDate ? 1 : -1
							) as Request[]
					)
				);
			});
		setLoading(false);
		return sub;
	}, [dispatch, user?.id]);

	return { requests, loading, user };
}
