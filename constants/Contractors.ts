import moment from 'moment';
import { Service } from './Services';

export interface Contractor {
	id?: string;
	firstName: string;
	lastName: string;
	services: Service[];
	phone: string;
	email: string;
	businessName?: string;
	connectedAccountId: string | null;
	isActive: boolean;
	addedOn: string;
	activatedOn?: string;
	address?: string;
	coords?: { lat: number; lng: number } | null;
	bio?: string;
	pushToken?: string;
	imageUrl?: string | null;
	password?: string;
	role: 'contractor' | 'consumer' | 'admin';
}

export interface Review {
	id?: string;
	reviewer: { name: string; userId: string };
	body: string;
	recommend: boolean;
	showName: boolean;
	contractorId: string;
	addedOn: string;
	rating: number;
	requestId: string;
}

export const contractorsData: Contractor[] = [
	// {
	// 	id: '0',
	// 	name: 'Melvin Rojas',
	// 	isActive: true,
	// 	isVerified: true,
	// 	rating: 4.7,
	// 	services: [
	// 		{ name: 'ceiling' },
	// 		{ name: 'flooring' },
	// 		{ name: 'electricity' },
	// 		{ name: 'windows' },
	// 	],
	// 	phone: '347-999-9999',
	// 	email: 'melvin.rojas@gmail.com',
	// 	imageUrl:
	// 		'https://st3.depositphotos.com/12985790/17645/i/1600/depositphotos_176455430-stock-photo-worker.jpg',
	// 	reviews: [
	// 		{
	// 			id: '8',
	// 			recommend: true,
	// 			reviewer: 'ramon alvarez',
	// 			showName: true,
	// 			body: 'Un excelente trabjo que hiciste',
	// 			addedOn: moment().subtract(2, 'days').format('lll'),
	// 		},
	// 		{
	// 			id: '15',
	// 			recommend: true,
	// 			reviewer: 'ramon alvarez',
	// 			showName: true,
	// 			body: 'Un excelente trabjo que hiciste',
	// 			addedOn: moment().subtract(5, 'days').format('lll'),
	// 		},
	// 		{
	// 			id: '36',
	// 			recommend: false,
	// 			reviewer: 'ramon alvarez',
	// 			showName: false,
	// 			body: 'Un excelente trabjo que hiciste',
	// 			addedOn: moment().subtract(8, 'days').format('lll'),
	// 		},
	// 	],
	// },
	// {
	// 	id: '1',
	// 	name: 'Aneury Ceballos',
	// 	rating: 4.0,
	// 	isActive: true,
	// 	isVerified: true,
	// 	services: [
	// 		{ name: 'ceiling' },
	// 		{ name: 'Electrical' },
	// 		{ name: 'cleaning' },
	// 	],
	// 	phone: '347-999-9999',
	// 	email: 'aneury.rojas@gmail.com',
	// 	imageUrl:
	// 		'https://st3.depositphotos.com/12985790/17645/i/1600/depositphotos_176455430-stock-photo-worker.jpg',
	// 	reviews: [
	// 		{
	// 			id: '0',
	// 			recommend: true,
	// 			reviewer: 'carlos ruiz',
	// 			showName: false,
	// 			body: 'What an excellent job fixing my ceiling',
	// 			addedOn: moment().subtract(6, 'days').format('lll'),
	// 		},
	// 	],
	// },
	// {
	// 	id: '2',
	// 	name: 'Luis Vasquez',
	// 	rating: 4.2,
	// 	services: [{ name: 'ceiling' }, { name: 'windows' }],
	// 	phone: '347-999-9999',
	// 	email: 'luis.rojas@gmail.com',
	// 	isActive: true,
	// 	isVerified: true,
	// 	imageUrl:
	// 		'https://st3.depositphotos.com/12985790/17645/i/1600/depositphotos_176455430-stock-photo-worker.jpg',
	// 	reviews: [
	// 		{
	// 			id: '1',
	// 			recommend: false,
	// 			reviewer: 'Pedro Smith',
	// 			showName: false,
	// 			body: 'What an excellent job fixing my house',
	// 			addedOn: moment().subtract(1, 'days').format('lll'),
	// 		},
	// 	],
	// },
	// {
	// 	id: '3',
	// 	name: 'Edickson Martinez',
	// 	rating: 3.8,
	// 	services: [{ name: 'ceiling' }],
	// 	isActive: true,
	// 	isVerified: true,
	// 	phone: '347-999-9999',
	// 	email: 'edick.rojas@gmail.com',
	// 	imageUrl:
	// 		'https://st3.depositphotos.com/12985790/17645/i/1600/depositphotos_176455430-stock-photo-worker.jpg',
	// 	reviews: [
	// 		{
	// 			id: '2',
	// 			recommend: false,
	// 			reviewer: 'Pedro Smith',
	// 			showName: false,
	// 			body: 'What an excellent job fixing my house',
	// 			addedOn: moment().subtract(23, 'days').format('lll'),
	// 		},
	// 	],
	// },
];
