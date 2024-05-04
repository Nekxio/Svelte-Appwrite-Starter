import { fail } from '@sveltejs/kit';
import { ID } from 'node-appwrite';
import { message, setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { signupSchema } from '$types/user';
import { dev } from '$app/environment';
import { createAdminClient, createSessionClient, safeAppwriteRequest, SESSION_COOKIE } from '$server/appwrite';
import { extractErrorMessage } from '$utils/errors';
import { SESSION_MAX_AGE } from '$lib/constants/global';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(signupSchema))
	};
};

export const actions: Actions = {
	default: async ({ request, cookies, url }) => {
		const form = await superValidate(request, zod(signupSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { email, password, name } = form.data;
		const { users, account } = createAdminClient();

		// Utiliser le tuple [data, error]
		const [user, userError] = await safeAppwriteRequest(() =>
			users.create(ID.unique(), email, undefined, password, name)
		);

		if (userError) {
			const validationErrors = extractErrorMessage(userError);
			if (validationErrors) {
				return message(form, validationErrors);
			}
			return setError(form, 'une erreur est survenue');
		}

		const [session, sessionError] = await safeAppwriteRequest(() =>
			account.createEmailPasswordSession(email, password)
		);

		if (sessionError) {
			return setError(form, 'une erreur est survenue');
		}

		cookies.set(SESSION_COOKIE, session!.secret, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: !dev,
			maxAge: SESSION_MAX_AGE
		});

		if (!user!.emailVerification) {
			const { account } = createSessionClient(cookies);
			const baseUrl = url.origin;
			await safeAppwriteRequest(() => account.createVerification(`${baseUrl}/verify`));
		}

		return {
			form,
			redirect: true
		};
	}
};
