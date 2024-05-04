import type { Locale } from '$lib/i18n';

type Language = {
	name: string;
	nativeName: string;
	code: Locale;
	flag: string;
};

export const languages: Language[] = [
	{
		name: 'English',
		nativeName: 'English',
		code: 'en',
		flag: '🇬🇧'
	},
	{
		name: 'French',
		nativeName: 'Français',
		code: 'fr',
		flag: '🇫🇷'
	}
	// Add more languages as needed
];
