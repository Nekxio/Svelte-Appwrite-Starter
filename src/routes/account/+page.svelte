<script lang="ts">
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { ideasStore } from '$stores/ideas';
	import type { SubmitFunction } from '@sveltejs/kit';
	import type { Idea } from '$types/idea';

	const formAddIdea: SubmitFunction = () => {
		return async ({ result, update }) => {
			await update({ reset: true });
			if (result.type === 'success') {
				const idea: Idea = result.data?.idea;
				ideasStore.addIdea(idea);
			}
		};
	};

	const formDeleteIdea: SubmitFunction = () => {
		return async ({ result, update }) => {
			await update();
			if (result.type === 'success') {
				await ideasStore.deleteIdea(result.data?.ideaId);
			}
		};
	};
</script>

<section>
	<div>
		<p>Email: {$page.data.user.email}</p>
		<p>Name: {$page.data.user.name}</p>
	</div>

	<h2>Submit Idea</h2>
	<form action="?/addIdea" method="post" use:enhance={formAddIdea}>
		<label>
			Title
			<input type="text" placeholder="Title" name="title" required />
		</label>
		<label>
			Description
			<textarea placeholder="Description" name="description" />
		</label>
		<button type="submit">Submit</button>
	</form>
	<div>
		{#if $ideasStore && $ideasStore.length}
			<ul>
				{#each $ideasStore as idea}
					<li>
						<strong>{idea.title}</strong>
						{#if idea.description}
							<p>{idea.description}</p>
						{/if}
						<form action="?/deleteIdea" method="post" use:enhance={formDeleteIdea}>
							<label><input type="hidden" name="ideaId" value={idea.$id} /></label>
							<button type="submit">Remove</button>
						</form>
					</li>
				{/each}
			</ul>
		{:else}
			<p>No ideas yet</p>
		{/if}
	</div>
</section>

<form action="?/logout" method="post">
	<button type="submit">Log out</button>
</form>
