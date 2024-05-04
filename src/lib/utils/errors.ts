import { i18n } from '$lib/i18n';
import { AppwriteError } from '$lib/server/appwrite';

type ErrorHandler = (error: AppwriteError) => string;

/**
 * Extrait un message d'erreur lisible à partir de différents types d'erreurs
 */
export const extractErrorMessage = (error: unknown): string => {
	if (error instanceof AppwriteError) {
		const handler = errorHandlers[error.code] || errorHandlers.default;
		return handler(error);
	}

	if (error instanceof Error) {
		return error.message;
	}

	return i18n.error_message({
		errorType: 'unknown',
		errorCode: 'unknown'
	});
};

const errorHandlers: Record<string | number, ErrorHandler> = {
	401: () => i18n.error_message({ errorType: 'auth', errorCode: '401' }),
	404: () => i18n.error_message({ errorType: 'resource', errorCode: '404' }),
	409: () => i18n.error_message({ errorType: 'resource', errorCode: '409' }),
	429: () => i18n.error_message({ errorType: 'server', errorCode: '429' }),
	default: (error) =>
		error.message ||
		i18n.error_message({
			errorType: 'server',
			errorCode: String(error.code)
		})
};
