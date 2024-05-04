<script lang="ts">
	import { i18n } from '$lib/i18n';
	import { setLocale } from '$lib/paraglide/runtime';
</script>

<h1>{i18n.hello_world({ name: 'SvelteKit User' })}</h1>
<div>
	<button onclick={() => setLocale('fr')}>fr</button>
	<button onclick={() => setLocale('en')}>en</button>
</div>
