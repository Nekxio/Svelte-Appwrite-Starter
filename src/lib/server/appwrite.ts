import { type Cookies } from '@sveltejs/kit';
import { Account, AppwriteException, Client, Databases, Storage, Teams, Users } from 'node-appwrite';
import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';

export interface AppwriteClient {
	client: Client;
	account: Account;
	databases: Databases;
	storage: Storage;
	teams: Teams;
	users: Users;
}

export type AppwriteListResponse<T> = {
	total: number;
	documents: T[];
};

export const SESSION_COOKIE = 'my-custom-session';

export const createAdminClient = (): AppwriteClient => {
	const client = new Client()
		.setEndpoint(env.APPWRITE_API_ENDPOINT)
		.setProject(env.APPWRITE_PROJECT_ID)
		.setKey(env.APPWRITE_API_KEY);

	return {
		client,
		account: new Account(client),
		databases: new Databases(client),
		storage: new Storage(client),
		teams: new Teams(client),
		users: new Users(client)
	};
};

export const createSessionClient = (cookies: Cookies): AppwriteClient => {
	const sessionCookie = cookies.get(SESSION_COOKIE);

	if (!sessionCookie) {
		throw new Error('Aucune session trouvée');
	}

	const client = new Client()
		.setEndpoint(env.APPWRITE_API_ENDPOINT)
		.setProject(env.APPWRITE_PROJECT_ID)
		.setSelfSigned(dev);

	client.setSession(sessionCookie);

	return {
		client,
		account: new Account(client),
		databases: new Databases(client),
		storage: new Storage(client),
		teams: new Teams(client),
		users: new Users(client)
	};
};

export const safeAppwriteRequest = async <T, R = T>(
	request: () => Promise<T>,
	transform?: (data: T) => R
): Promise<[R | null, AppwriteError | null]> => {
	const result = await executeAppwriteRequest(request);
	if (!transform || result[0] === null) {
		return result as [R | null, AppwriteError | null];
	}
	return transformAppwriteResponse(result, transform);
};

const executeAppwriteRequest = async <T>(request: () => Promise<T>): Promise<[T | null, AppwriteError | null]> => {
	try {
		const data = await request();
		return [data, null];
	} catch (error) {
		if (error instanceof AppwriteException) {
			const appwriteError = new AppwriteError({
				code: error.code,
				message: error.message,
				type: error.type,
				response: error.response
			});
			return [null, appwriteError];
		}
		return [
			null,
			new AppwriteError({
				code: 500,
				message: error instanceof Error ? error.message : 'Une erreur inattendue est survenue',
				type: 'unknown_error',
				response: String(error)
			})
		];
	}
};

const transformAppwriteResponse = <T, R>(
	[data, error]: [T | null, AppwriteError | null],
	transform: (data: T) => R
): [R | null, AppwriteError | null] => {
	if (error || data === null) {
		return [null, error];
	}
	try {
		return [transform(data), null];
	} catch (transformError) {
		return [
			null,
			new AppwriteError({
				code: 500,
				message:
					transformError instanceof Error
						? `Erreur de transformation: ${transformError.message}`
						: 'Erreur lors de la transformation des données',
				type: 'transform_error',
				response: String(transformError)
			})
		];
	}
};

export class AppwriteError extends Error {
	code: number;
	type: string;
	response: string;

	constructor({ code, message, type, response }: { code: number; message: string; type: string; response: string }) {
		super(message);
		this.code = code;
		this.type = type;
		this.response = response;
		this.name = 'AppwriteError';
	}

	toJSON() {
		return {
			name: this.name,
			message: this.message,
			code: this.code,
			type: this.type
		};
	}
}
