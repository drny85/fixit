export const validateFullName = (
	value: string,
	setErrorValue: (v: string) => React.SetStateAction<string>
) => {
	if (value.length < 5 || value.trimEnd().split(' ').length < 2) {
		setErrorValue('Please enter your full name');
	} else {
		setErrorValue('');
	}
	return true;
};
