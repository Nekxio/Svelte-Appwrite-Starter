<script lang="ts">
	import LangSwitch from '$components/ui/LangSwitch.svelte';
	import ThemeController from '$components/ui/ThemeController.svelte';
	import { page } from '$app/state';
	import { i18n } from '$lib/i18n';

	let user = $derived(page.data.user);
</script>

<header class="navbar bg-base-100 sticky top-0 z-10 px-4 shadow-sm">
	<div class="navbar-start">
		<div class="dropdown">
			<div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
				<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
				</svg>
			</div>
			<ul class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
				<li><a href="/todos">My todos</a></li>
				<li><a href="/account">{i18n['buttons.account']()}</a></li>
				<li><a href="/auth/logout">{i18n['buttons.logout']()}</a></li>
			</ul>
		</div>
		<a href="/" class="btn btn-ghost text-xl">SvelteWrite</a>
	</div>

	<div class="navbar-end gap-2">
		<ThemeController />
		<LangSwitch />
		{#if user}
			<ul class="menu menu-horizontal">
				<li><a href="/todos">My todos</a></li>
			</ul>

			<div class="dropdown dropdown-end">
				<div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
					<div class="w-10 rounded-full">
						<img alt="Tailwind CSS Navbar component" src={user.prefs.picture} />
					</div>
				</div>
				<ul class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
					<li><a href="/account">{i18n['buttons.account']()}</a></li>
					<li><a href="/auth/logout">{i18n['buttons.logout']()}</a></li>
				</ul>
			</div>
		{/if}
	</div>
</header>
