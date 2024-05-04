import { error } from '@sveltejs/kit';
import { createSessionClient, SESSION_COOKIE } from '$server/appwrite';

export async function load({ locals }) {
	return {
		user: locals.user
	};
}

export const actions = {
	default: async ({ cookies }) => {
		try {
			const { account } = createSessionClient(cookies);

			await account.deleteSession('current');
			cookies.delete(SESSION_COOKIE, { path: '/' });
		} catch {
			error(500);
		}
	}
};
