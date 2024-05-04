import { i18n } from '$lib/i18n';

export const getErrorMessage = (type: string) => {
	return i18n.error_messages({ type: type });
};
