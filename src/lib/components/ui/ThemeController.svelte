<script lang="ts">
	import { Moon, Sun } from '@lucide/svelte';
	import { onMount } from 'svelte';

	let colorScheme = $state<'light' | 'dark'>('light');

	const applyTheme = (theme: 'light' | 'dark') => {
		colorScheme = theme;
		document.documentElement.setAttribute('data-theme', theme);
		localStorage.setItem('theme', theme);
	};

	const toggleTheme = () => {
		const newTheme = colorScheme === 'light' ? 'dark' : 'light';
		applyTheme(newTheme);
	};

	onMount(() => {
		const savedTheme = localStorage.getItem('theme');
		const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

		if (savedTheme) {
			applyTheme(savedTheme as 'light' | 'dark');
		} else if (systemPrefersDark) {
			applyTheme('dark');
		} else {
			applyTheme('light');
		}

		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
			applyTheme(event.matches ? 'dark' : 'light');
		});
	});
</script>

<div class="btn btn-ghost btn-sm">
	<label class="swap swap-rotate">
		<input type="checkbox" class="theme-controller" checked={colorScheme === 'dark'} onchange={toggleTheme} />
		<Sun class="swap-on fill-current" />
		<Moon class="swap-off fill-current" />
	</label>
</div>
