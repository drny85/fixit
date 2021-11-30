import { createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../../firebase';
import { Log } from '../../types';

export const addLog = async (log: Log): Promise<boolean> => {
	try {
		await db.collection('logs').doc(log.requestId).collection('logs').add(log);
		return true;
	} catch (error) {
		console.log(error);
		return false;
	}
};

export const deleteLog = async (log: Log) => {
	try {
		await db
			.collection('logs')
			.doc(log.requestId)
			.collection('logs')
			.doc(log.id)
			.delete();
		return true;
	} catch (error) {
		return false;
	}
};
