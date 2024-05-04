import { type Actions } from '@sveltejs/kit';
import { createAdminClient } from '$server/appwrite';

export const actions: Actions = {
	resend: async ({ request, url }) => {
		try {
			const form = await request.formData();
			const email = form.get('email')?.toString();

			if (!email) {
				return {
					success: false,
					error: 'Email is required'
				};
			}

			const { account } = createAdminClient();

			const baseUrl = url.origin;
			await account.createVerification(`${baseUrl}/verify`);

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
