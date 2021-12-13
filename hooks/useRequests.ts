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

	const getAdminRequest = async () => {
		try {
			return db.collection('requests').onSnapshot((snapshop) => {
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
		} catch (error) {
			console.log(error);
		}
	};

	const getOtherRequests = async () => {
		try {
			return db
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
		} catch (error) {
			console.log(error);
		}
	};
	useEffect(() => {
		// const sub = db
		// 	.collection('requests')
		// 	.where(
		// 		user?.role === 'consumer' ? 'userId' : 'contractor.id',
		// 		'==',
		// 		user?.id
		// 	)
		// 	.orderBy('receivedOn', 'desc')
		// 	.onSnapshot((snapshop) => {
		// 		dispatch(
		// 			getRequests(
		// 				snapshop.docs
		// 					.map((doc) => {
		// 						return {
		// 							id: doc.id,
		// 							...doc.data(),
		// 						} as Request;
		// 					})
		// 					.sort((a, b) =>
		// 						a.serviceDate > b.serviceDate ? 1 : -1
		// 					) as Request[]
		// 			)
		// 		);
		// 	});
		let reqsub;
		(async () => {
			reqsub =
				(await user) && user?.role === 'admin'
					? getAdminRequest()
					: getOtherRequests();
		})();
		//const sub = user && user?.role === 'admin' ? getAdminRequest(): getOtherRequests()
		setLoading(false);
		return reqsub && reqsub;
	}, [dispatch, user?.id]);

	return { requests, loading, user };
}
