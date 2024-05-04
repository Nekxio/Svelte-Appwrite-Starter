<script lang="ts">
	import '$root/app.css';
	import { Toaster } from 'svelte-sonner';
	import Footer from '$components/ui/Footer.svelte';
	import Header from '$components/ui/Header.svelte';
	import { page } from '$app/state';
	import { getLocale } from '$lib/paraglide/runtime';

	let { children } = $props();

	let isHomePage = $derived(page.url.href.endsWith('5173/') || page.url.href.endsWith(`5173/${getLocale()}`));
</script>

<Header />
<main
	class="min-h-[calc(100vh-4rem)] md:px-0"
	class:p-4={!isHomePage}
	class:container={!isHomePage}
	class:mx-auto={!isHomePage}
>
	{@render children()}
	<Toaster position="bottom-right" />
</main>
<Footer />
