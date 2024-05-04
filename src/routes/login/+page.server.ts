import { SESSION_COOKIE, createAdminClient } from '$lib/server/appwrite';
import { error, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals }) => {
	locals.user && redirect(301, '/account');
};

export const actions: Actions = {
	login: async ({ request, cookies }) => {
		const form = await request.formData();
		const email = String(form.get('email'));
		const password = String(form.get('password'));
		try {
			const { account } = createAdminClient();

			const session = await account.createEmailPasswordSession(email, password);

			cookies.set(SESSION_COOKIE, session.secret, {
				sameSite: 'strict',
				expires: new Date(session.expire),
				secure: true,
				path: '/'
			});

			redirect(301, '/account');
		} catch (e) {
			typeof e === 'string' && error(500, e);
			e instanceof Error && error(500, e.message);
		}
	}
};
