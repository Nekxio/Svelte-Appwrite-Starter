<script lang="ts">
	import '$root/app.css';
	import { Toaster } from 'svelte-sonner';

	let { children } = $props();
</script>

<header></header>
<main>
	{@render children()}
	<Toaster position="bottom-right" />
</main>
<footer></footer>
