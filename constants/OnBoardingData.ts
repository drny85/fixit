import { DataProps } from '../components/Paginator';

export const data: DataProps[] = [
	{
		id: '1',
		title: 'Welcome',
		imageUrl: require('../assets/animations/hello.json'),
		subtitle:
			'Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus fuga eum vel cum ex laborum provident tempore autem aperiam nesciunt consequatur neque nostrum deserunt, delectus, minus omnis! Fugiat, laborum eligendi? Aliquid commodi aliquam totam laudantium impedit.',
	},
	{
		id: '2',
		title: 'Requesting Services',
		imageUrl: require('../assets/animations/customer.json'),
		subtitle:
			'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ducimus quia tempore assumenda, magnam eos eligendi. Architecto.',
	},
	{
		id: '3',
		title: 'Signing Up As Contractor',
		imageUrl: require('../assets/animations/working.json'),
		subtitle:
			'Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis explicabo ullam cupiditate?',
	},
	{
		id: '4',
		title: 'Lets Get You Started!',
		imageUrl: require('../assets/animations/final.json'),
		subtitle:
			'Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis explicabo ullam cupiditate?',
		buttons: ['Consumer', 'Contractor'],
	},
];
