<script lang="ts">
	import { Control, FieldErrors, Fieldset, Label, Legend } from 'formsnap';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import type { Todo, TodoCreate } from '$types/todo';
	import { todoCreateSchema } from '$types/todo';
	import { i18n } from '$lib/i18n';

	interface Props {
		form: SuperValidated<TodoCreate>;
		onComplete?: () => void;
		onTodoCreated?: (todo: Todo) => void;
	}

	const { form: todoForm, onComplete = () => {}, onTodoCreated = () => {} }: Props = $props();

	const form = superForm(todoForm, {
		validators: zodClient(todoCreateSchema),
		onResult: ({ result }) => {
			if (result.type === 'success' && result?.data) {
				onTodoCreated(result.data.todo);
				onComplete();
			}
		}
	});

	const { form: formData, enhance, message, delayed } = form;
</script>

<form action="?/createTodo" method="POST" use:enhance>
	<Fieldset {form} name="title" class="fieldset">
		<Legend class="fieldset-legend">{i18n['todo_form.title']()}</Legend>
		<Control>
			{#snippet children({ props })}
				<Label>
					<input
						{...props}
						class="input w-full"
						type="text"
						bind:value={$formData.title}
						placeholder={i18n['todo_form.title_placeholder']()}
						disabled={$delayed}
					/>
				</Label>
			{/snippet}
		</Control>
		<FieldErrors class="text-error text-sm" />
	</Fieldset>

	<Fieldset {form} name="description" class="fieldset">
		<Legend class="fieldset-legend">{i18n['todo_form.description']()}</Legend>
		<Control>
			{#snippet children({ props })}
				<Label>
					<textarea
						{...props}
						class="textarea w-full"
						bind:value={$formData.description}
						placeholder={i18n['todo_form.description_placeholder']()}
						rows="3"
						disabled={$delayed}
					></textarea>
				</Label>
			{/snippet}
		</Control>
		<FieldErrors class="text-error text-sm" />
	</Fieldset>

	<div class="flex justify-end gap-2">
		<button type="button" class="btn btn-secondary btn-ghost" onclick={onComplete} disabled={$delayed}>
			{i18n['todo_form.cancel']()}
		</button>
		<button type="submit" class="btn btn-primary" disabled={$delayed}>
			{i18n['todo_form.create']()}
			{#if $delayed}
				<span class="loading loading-spinner loading-sm"></span>
			{/if}
		</button>
	</div>

	{#if $message}
		<div class="text-red-500">
			<ul class="list-disc pl-5">
				{#each Object.values($message).flat() as error (error)}
					<li>{error}</li>
				{/each}
			</ul>
		</div>
	{/if}
</form>
