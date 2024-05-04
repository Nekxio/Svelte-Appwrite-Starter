import { createSessionClient, SESSION_COOKIE } from '$lib/server/appwrite';
import { error, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const { account } = createSessionClient(event);
	const session = event.cookies.get(SESSION_COOKIE);

	if (session) {
		try {
			event.locals.user = await account.get();
			event.locals.client = account.client;
		} catch (e) {
			typeof e === 'string' && error(500, e);
			e instanceof Error && error(500, e.message);
		}
	} else {
		event.locals.user = undefined;
	}

	return resolve(event);
};
