import { redirect, type Actions } from '@sveltejs/kit';
import { createSessionClient } from '$lib/server/appwrite';

export const load = async ({ url, cookies }) => {
	const userId = url.searchParams.get('userId');
	const secret = url.searchParams.get('secret');

	if (!userId || !secret) {
		redirect(302, '/auth/login');
	}

	try {
		const { account } = createSessionClient(cookies);

		await account.updateVerification(userId, secret);
		const isVerified = await account.get().then((user) => user.emailVerification);
		return {
			success: true,
			message: 'Verification email sent. Please check your inbox.',
			isVerified
		};
	} catch {
		return {
			error: 'Failed to verify email. The link may be expired or invalid.'
		};
	}
};

export const actions: Actions = {
	default: async ({ locals, url, cookies }) => {
		try {
			if (!locals.user) {
				return {
					success: false,
					error: 'You must be logged in to request a verification email'
				};
			}

			if (locals.user.emailVerification) {
				return {
					success: true,
					message: 'Your email is already verified'
				};
			}

			const { account } = createSessionClient(cookies);

			const baseUrl = url.origin;
			await account.createVerification(`${baseUrl}/verify-email`);

			return {
				success: true,
				message: 'Verification email sent. Please check your inbox.'
			};
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : 'An error occurred while sending the verification email'
			};
		}
	}
};
