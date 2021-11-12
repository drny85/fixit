const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
export const formatPhone = (phone: string) => {
	return phone.replace(phoneRegex, '($1) $2-$3');
};
