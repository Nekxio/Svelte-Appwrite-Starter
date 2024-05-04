<script lang="ts">
	import { languages } from '$constants/languages.js';
	import { getLocale, setLocale } from '$lib/paraglide/runtime';
</script>

<div class="dropdown dropdown-end">
	<div tabindex="0" role="button" class="btn btn-sm btn-ghost">
		<span class="uppercase">{getLocale()}</span>
	</div>
	<ul class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-fit p-2 shadow">
		{#each Object.values(languages) as language (language)}
			<li>
				<button onclick={() => setLocale(language.code)} class="flex items-center gap-2 uppercase">
					<span>{language.flag}</span>
					<span>{language.nativeName}</span>
				</button>
			</li>
		{/each}
	</ul>
</div>
