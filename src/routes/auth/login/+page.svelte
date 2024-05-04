<script lang="ts">
	import type { SubmitFunction } from '@sveltejs/kit';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { i18n } from '$lib/i18n';

	let error = $state('');

	const noRedirectRoutes = ['/logout', '/api', '/callback'];

	let redirectParam = page.url.searchParams.get('redirectTo') || '/account';

	const isSafeRedirect = !noRedirectRoutes.some(
		(route) => redirectParam === route || redirectParam.startsWith(`${route}/`)
	);
	const redirectTo = isSafeRedirect ? redirectParam : '/account';

	const handleSubmit: SubmitFunction = () => {
		return async ({ update, result }) => {
			await update({ reset: false });
			if (result.type === 'success') {
				if (result?.data?.success) {
					await goto(redirectTo);
				} else if (result?.data?.error) {
					error = result.data.error;
				}
			} else {
				error = i18n['login.error_message']();
			}
		};
	};
</script>

<form action="?/login" method="post" use:enhance={handleSubmit}>
	<input id="email" name="email" placeholder={i18n['login.email_placeholder']()} type="email" />
	<input id="password" name="password" placeholder={i18n['login.password_placeholder']()} type="password" />
	<button type="submit">{i18n['login.login_button']()}</button>
	{#if error}
		<div class="error">{error}</div>
	{/if}
</form>

<a href="/register">{i18n['login.need_account']()}</a>
<div class="mt-2">
	<a href="/resend-verification">{i18n['login.verification_email']()}</a>
</div>
