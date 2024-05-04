import { fail, type Actions } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { loginSchema } from '$types/user-auth';
import { dev } from '$app/environment';
import { createAdminClient, createSessionClient, safeAppwriteRequest, SESSION_COOKIE } from '$server/appwrite';
import { getErrorMessage } from '$utils/errors';
import { SESSION_MAX_AGE } from '$lib/constants/global';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const noRedirectRoutes = ['/logout', '/api', '/callback'];
	const redirectParam = url.searchParams.get('redirectTo') || '/todos';
	const isSafeRedirect = !noRedirectRoutes.some(
		(route) => redirectParam === route || redirectParam.startsWith(`${route}/`)
	);
	const redirectTo = isSafeRedirect ? redirectParam : '/todos';
	return {
		loginForm: await superValidate(zod(loginSchema)),
		redirectTo
	};
};

export const actions: Actions = {
	login: async ({ request, cookies, url }) => {
		const form = await superValidate(request, zod(loginSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { email, password } = form.data;
		const { account: adminAccount } = createAdminClient();

		const [session, loginError] = await safeAppwriteRequest(() =>
			adminAccount.createEmailPasswordSession(email, password)
		);

		if (loginError || !session) {
			return message(form, getErrorMessage(loginError?.type ?? 'unknown_error'), { status: 400 });
		}

		cookies.set(SESSION_COOKIE, session.secret, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: !dev,
			maxAge: SESSION_MAX_AGE
		});

		const { account } = createSessionClient(cookies);
		const [user, userError] = await safeAppwriteRequest(() => account.get());

		if (userError || !user) {
			return message(form, userError?.translatedErrorMessage ?? getErrorMessage('unknown_error'), { status: 400 });
		}

		if (!user.emailVerification) {
			const baseUrl = url.origin;
			await safeAppwriteRequest(() => account.createVerification(`${baseUrl}/auth/verify`));
		}

		return { form, success: true, successMessage: 'Connexion réussie !' };
	}
};
