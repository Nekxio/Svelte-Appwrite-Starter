<script lang="ts">
	import { page } from '$app/stores';
</script>

<div class="h-screen flex items-center justify-center">
	<div class="text-center">
		<h1 class="text-4xl font-bold">{$page.status}</h1>
		<p class="text-lg">{$page.error?.message}</p>
	</div>
</div>
