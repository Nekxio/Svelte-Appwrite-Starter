import { m } from '$lib/paraglide/messages';

export const locales = ['fr', 'en'] as const;
export type Locale = (typeof locales)[number];
export const i18n = m;
