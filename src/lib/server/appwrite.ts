import { base } from '$app/paths';
import { APPWRITE_ENDPOINT, APPWRITE_KEY, APPWRITE_PROJECT } from '$env/static/private';
import { error, redirect, type RequestEvent } from '@sveltejs/kit';
import { Account, Client } from 'node-appwrite';
export const SESSION_COOKIE: string = 'user-session';

export const createAdminClient = (): { readonly account: Account } => {
	const client = new Client().setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT).setKey(APPWRITE_KEY);

	return {
		get account() {
			return new Account(client);
		}
	};
};

export const createSessionClient = (event: RequestEvent): { readonly account: Account } => {
	const client = new Client().setEndpoint(APPWRITE_ENDPOINT).setProject(APPWRITE_PROJECT);

	const session = event.cookies.get(SESSION_COOKIE);
	session && client.setSession(session);

	return {
		get account() {
			return new Account(client);
		}
	};
};

export const removeUserSession = async (event: RequestEvent): Promise<void> => {
	const { account } = createSessionClient(event);
	try {
		await account.deleteSession('current');
		event.cookies.delete(SESSION_COOKIE, { path: '/' });
	} catch (e) {
		typeof e === 'string' && error(500, e);
		e instanceof Error && error(500, e.message);
	}

	redirect(301, `${base}/`);
};
