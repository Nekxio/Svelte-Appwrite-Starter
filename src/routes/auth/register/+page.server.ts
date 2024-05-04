import { fail } from '@sveltejs/kit';
import { ID } from 'node-appwrite';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { registerSchema } from '$types/user-auth';
import { dev } from '$app/environment';
import { createAdminClient, createSessionClient, safeAppwriteRequest, SESSION_COOKIE } from '$server/appwrite';
import { getErrorMessage } from '$utils/errors';
import { SESSION_MAX_AGE } from '$lib/constants/global';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		registerForm: await superValidate(zod(registerSchema))
	};
};

export const actions: Actions = {
	register: async ({ request, cookies, url }) => {
		const form = await superValidate(request, zod(registerSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const { email, password, name } = form.data;
		const { users, account } = createAdminClient();

		const [user, userError] = await safeAppwriteRequest(() =>
			users.create(ID.unique(), email, undefined, password, name)
		);

		if (userError || !user) {
			return message(form, userError?.translatedErrorMessage ?? getErrorMessage(userError?.type ?? 'unknown_error'), {
				status: 400
			});
		}

		await safeAppwriteRequest(() =>
			users.updatePrefs(user.$id, {
				picture:
					'https://fra.cloud.appwrite.io/v1/storage/buckets/681e6bb00013d12e212c/files/6820831400168306d9bc/view?project=67f2dd640016ff5cba7d'
			})
		);

		const [session, sessionError] = await safeAppwriteRequest(() =>
			account.createEmailPasswordSession(email, password)
		);

		if (sessionError || !session) {
			return message(
				form,
				sessionError?.translatedErrorMessage ?? getErrorMessage(sessionError?.type ?? 'unknown_error'),
				{ status: 400 }
			);
		}

		cookies.set(SESSION_COOKIE, session.secret, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: !dev,
			maxAge: SESSION_MAX_AGE
		});

		if (!user.emailVerification) {
			const { account } = createSessionClient(cookies);
			const baseUrl = url.origin;
			await safeAppwriteRequest(() => account.createVerification(`${baseUrl}/auth/verify`));
		}

		return {
			form,
			success: true,
			successMessage: 'Compte créé avec succès !'
		};
	}
};
