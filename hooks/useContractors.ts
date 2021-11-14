import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { setUsers } from '../redux/authReducer/authSlider';
import { useAppSelector, useAppDispatch } from '../redux/store';

export default function useContractors() {
	const dispatch = useAppDispatch();
	const { users } = useAppSelector((state) => state.auth);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		const sub = db
			.collection('users')
			.where('role', '==', 'contractor')
			.onSnapshot((snapshop) => {
				dispatch(
					setUsers(snapshop.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
				);
			});
		setLoading(false);

		return sub;
	}, [dispatch]);

	return { users, loading };
}
