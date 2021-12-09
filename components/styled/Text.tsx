import styled from 'styled-components/native';
import * as Animatable from 'react-native-animatable';

interface TextProps {
	small?: boolean;
	large?: boolean;
	title?: boolean;
	caption?: boolean;
	center?: boolean;
	left?: boolean;
	bold?: boolean;
	right?: boolean;
	darkText?: boolean;
	lightText?: boolean;
	capitalize?: boolean;
	uppercase?: boolean;
	lowercase?: boolean;
	medium?: boolean;
	tange?: boolean;
	xlarge?: boolean;
}

const Text = styled(Animatable.Text)<TextProps>`
	color: ${({ theme }) => (theme.mode === 'dark' ? 'white' : 'black')};
	margin: 5px;
	font-family: ${({ tange }) => (tange ? 'tange' : 'montserrat')};
	font-weight: 900;

	${({ small, medium, large, xlarge }: any) => {
		switch (true) {
			case small:
				return `font-size: 12px`;
			case large:
				return `font-size: 24px`;
			case medium:
				return `font-size: 18px`;
			case xlarge:
				return `font-size: 40px`;

			default:
				return `font-size: 16px`;
		}
	}};
	${({ title, caption }: any) => {
		switch (true) {
			case title:
				return `font-family: montserrat-bold; font-size:22px`;
			case caption:
				return `font-family: italic; font-size:13px`;
			default:
				return `font-weight: 500`;
		}
	}};
	${({ left, center, right }: any) => {
		switch (true) {
			case left:
				return `text-align: left`;
			case center:
				return `text-align: center`;
			case right:
				return `text-align: right`;
		}
	}};
	${({ capitalize, uppercase, lowercase }: any) => {
		switch (true) {
			case capitalize:
				return `text-transform: capitalize`;
			case uppercase:
				return `text-transform: uppercase`;
			case lowercase:
				return `text-transform: lowercase`;
		}
	}};
	${({ bold }: any) => {
		switch (true) {
			case bold:
				return `font-family: montserrat-bold;`;
		}
	}};

	${({ darkText, lightText }: any) => {
		switch (true) {
			case darkText:
				return `color: black`;

			case lightText:
				return `color:white`;
		}
	}}
`;

export default Text;
