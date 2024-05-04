import { type Actions } from '@sveltejs/kit';
import { createSessionClient, safeAppwriteRequest, SESSION_COOKIE } from '$server/appwrite';

export const actions: Actions = {
	default: async ({ cookies }) => {
		try {
			const { account } = createSessionClient(cookies);
			await safeAppwriteRequest(() => account.deleteSession('current'));
		} finally {
			cookies.delete(SESSION_COOKIE, { path: '/' });
		}
		return { success: true };
	}
};
