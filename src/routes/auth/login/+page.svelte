<script lang="ts">
	import LoginForm from '$components/forms/LoginForm.svelte';
	import { i18n } from '$lib/i18n';

	let { data } = $props();
</script>

<section class="mt-20 flex min-h-screen min-w-full flex-col items-center">
	<h1 class="mb-4 text-3xl font-bold">{i18n['login.title']()}</h1>
	<LoginForm form={data.loginForm} redirectTo={data.redirectTo} />
</section>
