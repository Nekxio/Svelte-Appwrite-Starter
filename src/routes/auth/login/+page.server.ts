import { type Actions } from '@sveltejs/kit';
import { dev } from '$app/environment';
import { createAdminClient, SESSION_COOKIE } from '$server/appwrite';
import { SESSION_MAX_AGE } from '$lib/constants/global';

export const actions: Actions = {
	login: async ({ request, cookies }) => {
		try {
			const form = await request.formData();
			const email = form.get('email')?.toString() || '';
			const password = form.get('password')?.toString() || '';

			const { account } = createAdminClient();

			const session = await account.createEmailPasswordSession(email, password);

			const user = await account.get();

			if (!user.emailVerification) {
				await account.deleteSession(session.$id);

				return {
					success: false,
					error: 'Please verify your email before logging in. Check your inbox for the verification link.'
				};
			}

			cookies.set(SESSION_COOKIE, session.secret, {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: !dev,
				maxAge: SESSION_MAX_AGE
			});

			return {
				success: true
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : 'Invalid email or password'
			};
		}
	}
};
