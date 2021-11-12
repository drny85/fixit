// import original module declarations
import 'styled-components/native';

// and extend them!
enum ThemeMode {
	dark = 'dark',
	light = 'light',
}
declare module 'styled-components' {
	export interface DefaultTheme {
		mode: 'dark' | 'light';
		BACKGROUND_COLOR: string;
		TEXT_COLOR: string;
		BUTTON_TEXT_COLOR: string;
		PRIMARY_BUTTON_COLOR: string;
		SHADOW_COLOR: string;
		SECONDARY_BUTTON_COLOR: string;
		STATUS_BAR: ThemeMode | string;
		ASCENT: string;
	}
}
