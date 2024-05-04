<script lang="ts">
	import type { SubmitFunction } from '@sveltejs/kit';
	import { onMount } from 'svelte';
	import { enhance } from '$app/forms';
	import { i18n } from '$lib/i18n';

	interface ResendResult {
		success: boolean;
		message?: string;
		error?: string;
	}

	interface Props {
		formAction?: string;
		successRedirect?: string;
		showLogoutLink?: boolean;
	}

	let { formAction = '', successRedirect, showLogoutLink = true }: Props = $props();

	let successMessage = $state('');
	let errorMessage = $state('');
	let countdown = $state(60);
	let isButtonDisabled = $state(true);

	const startCountdown = () => {
		countdown = 60;
		isButtonDisabled = true;
		const timer = setInterval(() => {
			countdown -= 1;
			if (countdown <= 0) {
				clearInterval(timer);
				isButtonDisabled = false;
			}
		}, 1000);

		return timer;
	};

	const handleResend: SubmitFunction = () => {
		return async ({ result }) => {
			if (result.type === 'success' && result.data) {
				const data = result.data as ResendResult;
				if (data.success) {
					successMessage = data.message || i18n['email_verification.success_sent']();
					errorMessage = '';
					startCountdown();

					if (successRedirect) {
						window.location.href = successRedirect;
					}
				} else if (data.error) {
					errorMessage = data.error;
					successMessage = '';
				}
			} else {
				errorMessage = i18n['email_verification.error_sending']();
				successMessage = '';
			}
		};
	};

	onMount(() => startCountdown());
</script>

<div class="email-verification-container">
	<h1 class="mb-4 text-2xl font-bold">{i18n['email_verification.required_title']()}</h1>

	<div class="mb-4 rounded border border-yellow-400 bg-yellow-100 px-4 py-3 text-yellow-700">
		<p>
			{i18n['email_verification.required_message']()}
		</p>
	</div>

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

	<form action={formAction} method="post" use:enhance={handleResend}>
		<p class="mb-4">{i18n['email_verification.didnt_receive']()}</p>
		<button
			type="submit"
			class="flex items-center justify-center gap-2 rounded px-4 py-2 text-white transition-colors"
			class:bg-blue-500={!isButtonDisabled}
			class:hover:bg-blue-600={!isButtonDisabled}
			class:bg-gray-400={isButtonDisabled}
			disabled={isButtonDisabled}
		>
			{#if isButtonDisabled}
				<span>{i18n['email_verification.wait_button']()}</span>
				<span class="countdown font-mono text-xl">
					<span style="--value:{countdown};" aria-live="polite" aria-label={String(countdown)}>{countdown}</span>
				</span>
			{:else}
				{i18n['email_verification.resend_button']()}
			{/if}
		</button>
	</form>

	{#if showLogoutLink}
		<div class="mt-4">
			<a href="/logout" class="text-blue-500 hover:underline">{i18n['buttons.logout']()}</a>
		</div>
	{/if}
</div>
