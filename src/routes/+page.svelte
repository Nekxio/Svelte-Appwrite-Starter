<script lang="ts">
	import Welcome from '$components/Welcome.svelte';
	export let data;
	const { title } = data;
</script>

<section>
	<Welcome {title} />
</section>
