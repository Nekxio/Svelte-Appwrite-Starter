<script lang="ts">
	import SendEmailVerification from '$components/auth/SendEmailVerification.svelte';
	import { i18n } from '$lib/i18n';

	let { data } = $props();
</script>

{#if data.isVerified}
	<div class="rounded border border-green-400 bg-green-100 px-4 py-3 text-green-700">
		<h1 class="mb-2 text-2xl font-bold">{i18n['email_verification.success_title']()}</h1>
		<p>
			{i18n['email_verification.success_message']()}
		</p>
	</div>

	<div class="mt-4">
		<a href="/account" class="inline-block rounded bg-blue-500 px-4 py-2 text-white">
			{i18n['email_verification.access_account']()}
		</a>
	</div>
{:else}
	<SendEmailVerification />
{/if}
