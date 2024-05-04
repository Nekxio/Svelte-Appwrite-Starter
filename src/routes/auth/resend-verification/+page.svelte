<script lang="ts">
	import type { SubmitFunction } from '@sveltejs/kit';
	import { enhance } from '$app/forms';
	import { i18n } from '$lib/i18n';

	let errorMessage = $state('');
	let successMessage = $state('');
	let email = $state('');

	const handleSubmit: SubmitFunction = () => {
		return async ({ result }) => {
			if (result.type === 'success') {
				if (result?.data && result.data.success) {
					successMessage = result.data.message;
					email = '';
				} else if (result?.data && result.data.error) {
					errorMessage = result.data.error;
				}
			} else {
				errorMessage = i18n['resend_verification.error_message']();
			}
		};
	};
</script>

<div class="container mx-auto p-4">
	<h1 class="mb-4 text-2xl font-bold">{i18n['resend_verification.title']()}</h1>

	{#if successMessage}
		<div class="mb-4 rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700">
			{successMessage}
		</div>
	{/if}

	{#if errorMessage}
		<div class="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
			{errorMessage}
		</div>
	{/if}

	<form action="?/resend" method="post" use:enhance={handleSubmit}>
		<div class="mb-4">
			<label for="email" class="mb-2 block">{i18n['resend_verification.email_label']()}</label>
			<input type="email" id="email" name="email" bind:value={email} class="w-full rounded border p-2" required />
		</div>

		<button type="submit" class="rounded bg-blue-500 px-4 py-2 text-white">
			{i18n['resend_verification.resend_button']()}
		</button>
	</form>

	<div class="mt-4">
		<a href="/login" class="text-blue-500">{i18n['resend_verification.back_to_login']()}</a>
	</div>
</div>
