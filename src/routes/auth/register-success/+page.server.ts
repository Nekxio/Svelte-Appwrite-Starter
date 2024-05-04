import { redirect, type Actions } from '@sveltejs/kit';
import { createSessionClient } from '$server/appwrite';

export const load = ({ locals }) => {
	if (locals?.user?.emailVerification) {
		redirect(302, '/account');
	}

	return {};
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
