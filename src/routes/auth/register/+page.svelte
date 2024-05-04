<script lang="ts">
	import RegisterForm from '$components/forms/RegisterForm.svelte';
	import { i18n } from '$lib/i18n';

	let { data } = $props();
</script>

<section class="mt-20 flex min-h-screen min-w-full flex-col items-center">
	<h1 class="mb-4 text-3xl font-bold">{i18n['register.title']()}</h1>
	<RegisterForm form={data.registerForm} />
</section>
