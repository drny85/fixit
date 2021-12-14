import { DefaultTheme } from 'styled-components';

export const lightTheme: DefaultTheme = {
	mode: 'light',
	BACKGROUND_COLOR: '#ffffff',
	TEXT_COLOR: '#212121',
	BUTTON_TEXT_COLOR: '#ffffff',
	PRIMARY_BUTTON_COLOR: '#1d3557',
	SHADOW_COLOR: 'rgba(0, 0, 0, 0.19)',
	SECONDARY_BUTTON_COLOR: '#f1faee',
	DONE_COLOR: '#023e8a',
	STATUS_BAR: 'dark',
	ASCENT: '#ede0d4',
};

export const darkTheme: DefaultTheme = {
	mode: 'dark',
	BACKGROUND_COLOR: '#212121',
	TEXT_COLOR: '#ffffff',
	DONE_COLOR: '#023e8a',
	BUTTON_TEXT_COLOR: '#ffffff',
	PRIMARY_BUTTON_COLOR: '#1d3557',
	SHADOW_COLOR: 'rgba(0, 0, 0, 0.19)',
	SECONDARY_BUTTON_COLOR: '#f1faee',
	STATUS_BAR: 'light',
	ASCENT: '#ede0d4',
};
