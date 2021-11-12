import styled from 'styled-components/native';

interface ButtonProps {
	primary?: boolean;
	secondary?: boolean;
	small?: boolean;
	large?: boolean;
	block?: boolean;
}
const Button = styled.TouchableOpacity<ButtonProps>`
	margin: 10px;
	background-color: ${({ theme, secondary }) =>
		secondary ? theme.SECONDARY_BUTTON_COLOR : theme.PRIMARY_BUTTON_COLOR};
	border-radius: 15px;
	${({ small, large, block }: any) => {
		switch (true) {
			case small:
				return `padding: 10px 20px`;
			case large:
				return `padding: 25px 60px`;
			case block:
				return `padding: 10px 20px`;
			default:
				return `padding: 15px 35px`;
		}
	}};
`;

export default Button;
