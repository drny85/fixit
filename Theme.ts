import { DefaultTheme } from 'styled-components';

export const lightTheme: DefaultTheme = {
	mode: 'light',
	BACKGROUND_COLOR: '#ffffff',
	TEXT_COLOR: '#212121',
	BUTTON_TEXT_COLOR: '#ffffff',
	PRIMARY_BUTTON_COLOR: '#a11d33',
	SHADOW_COLOR: 'rgba(0, 0, 0, 0.19)',
	SECONDARY_BUTTON_COLOR: '#370617',
	DONE_COLOR: '#0b525b',
	STATUS_BAR: 'dark',
	ASCENT: '#2d6a4f',
};

export const darkTheme: DefaultTheme = {
	mode: 'dark',
	BACKGROUND_COLOR: '#212121',
	TEXT_COLOR: '#fff',
	DONE_COLOR: '#0b525b',
	BUTTON_TEXT_COLOR: '#ffffff',
	PRIMARY_BUTTON_COLOR: '#a11d33',
	SHADOW_COLOR: 'rgba(0, 0, 0, 0.19)',
	SECONDARY_BUTTON_COLOR: '#370617',
	STATUS_BAR: 'light',
	ASCENT: '#2d6a4f',
};
