import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { useAppSelector } from '../redux/store';

export interface Message {
	id?: string;
	senderId: string;
	receiverId: string;
	requestId: string;
	body: string;
	sentOn: string;
}

export default function useMessages() {
	const { request } = useAppSelector((state) => state.requests);
	const [loading, setLoading] = useState(true);
	const [messages, setMessages] = useState<Message[]>([]);

	useEffect(() => {
		db.collection('chats')
			.doc(request?.id)
			.collection('messages')
			.onSnapshot((snapshot) =>
				setMessages(
					snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Message))
				)
			);
		setLoading(false);
	}, [request?.id]);

	return { messages, loading };
}
