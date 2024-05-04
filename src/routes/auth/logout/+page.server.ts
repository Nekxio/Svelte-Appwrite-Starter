import { redirect } from '@sveltejs/kit';
import { createSessionClient, safeAppwriteRequest, SESSION_COOKIE } from '$server/appwrite';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	try {
		const { account } = createSessionClient(cookies);
		await safeAppwriteRequest(() => account.deleteSession('current'));
	} finally {
		cookies.delete(SESSION_COOKIE, { path: '/' });
	}
	redirect(302, '/auth/login');
};
