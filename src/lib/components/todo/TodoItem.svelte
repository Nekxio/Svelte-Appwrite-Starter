<script lang="ts">
	import { Check, Clock, Pencil, Save, Trash, X } from '@lucide/svelte';
	import { Control, FieldErrors, Fieldset, Label, Legend } from 'formsnap';
	import { toast } from 'svelte-sonner';
	import { slide } from 'svelte/transition';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { ZodSchema } from 'zod';
	import {
		todoIdSchema,
		todoUpdateSchema,
		todoUpdateStatusSchema,
		type Todo,
		type TodoDelete,
		type TodoUpdate,
		type TodoUpdateStatus
	} from '$types/todo';
	import { i18n } from '$lib/i18n';

	interface Props {
		todo: Todo;
		onTodoUpdated?: (todo: Todo, message: string) => void;
		onTodoDeleted?: (todoId: string, message: string) => void;
	}

	let { onTodoUpdated = () => {}, onTodoDeleted = () => {}, todo }: Props = $props();
	let isEditing = $state(false);

	const createForm = <T extends Record<string, unknown>, R>(
		data: T,
		schema: ZodSchema<T>,
		id: string,
		callback: (result: R, message: string) => void
	) =>
		superForm(data, {
			validators: zodClient(schema),
			id,
			onResult: ({ result }) => {
				if (result.type === 'success') {
					if (result?.data?.todo) {
						callback(result.data.todo as R, result.data.successMessage);
					} else if (result?.data?.success) {
						callback(data['$id'] as unknown as R, result.data.successMessage);
					}
				} else if (result.type === 'error') {
					toast.error($statusMessage || $deleteMessage || $contentMessage);
				}
			}
		});

	const updateStatusForm = createForm<TodoUpdateStatus, Todo>(
		{ $id: todo.$id, isComplete: todo.isComplete },
		todoUpdateStatusSchema,
		`update-status-${todo.$id}`,
		onTodoUpdated
	);

	const deleteForm = createForm<TodoDelete, { deletedId: string; successMessage: string }>(
		{ $id: todo.$id },
		todoIdSchema,
		`delete-${todo.$id}`,
		(result, msg) => onTodoDeleted(result.deletedId, msg)
	);
	const contentForm = createForm<TodoUpdate, Todo>(
		{ $id: todo.$id, title: todo.title, description: todo.description || '' },
		todoUpdateSchema,
		`content-${todo.$id}`,
		(updatedTodo: Todo, msg: string) => {
			onTodoUpdated(updatedTodo, msg);
			isEditing = false;
		}
	);

	const { enhance: enhanceStatus, delayed: statusDelayed, message: statusMessage } = updateStatusForm;
	const { enhance: enhanceDelete, delayed: deleteDelayed, message: deleteMessage } = deleteForm;
	const { enhance: enhanceContent, delayed: contentDelayed, message: contentMessage } = contentForm;

	const toggleEditMode = () => (isEditing = !isEditing);

	const handleCardClick = (e: MouseEvent) => {
		const target = e.target as HTMLElement;
		if (!target.closest('form')) toggleEditMode();
	};

	const handleKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && (isEditing = false);
</script>

<div
	class="card bg-base-100 card-sm w-full cursor-pointer shadow-sm"
	onclick={handleCardClick}
	onkeydown={handleKeyDown}
	class:bg-blue-50={isEditing}
	role="button"
	tabindex="0"
>
	<div class="card-body h-full justify-between">
		{#if isEditing}
			<form action="?/updateTodoContent" method="POST" use:enhanceContent transition:slide={{ duration: 300 }}>
				<button
					type="button"
					class="btn btn-sm btn-ghost btn-circle absolute top-2 right-2"
					onclick={toggleEditMode}
					disabled={$contentDelayed}
				>
					<X size={16} />
				</button>
				<input type="hidden" name="$id" value={todo.$id} />
				<Fieldset form={contentForm} name="title" class="fieldset">
					<Legend class="fieldset-legend">{i18n['todo_form.title']()}</Legend>
					<Control>
						{#snippet children({ props })}
							<Label>
								<input
									{...props}
									class="input w-full"
									type="text"
									bind:value={todo.title}
									placeholder={i18n['todo_form.title_placeholder']()}
									disabled={$contentDelayed}
								/>
							</Label>
						{/snippet}
					</Control>
					<FieldErrors class="text-error text-sm" />
				</Fieldset>

				<Fieldset form={contentForm} name="description" class="fieldset">
					<Legend class="fieldset-legend">{i18n['todo_form.description']()}</Legend>
					<Control>
						{#snippet children({ props })}
							<Label>
								<textarea
									{...props}
									class="textarea w-full"
									bind:value={todo.description}
									placeholder={i18n['todo_form.description_placeholder']()}
									rows="3"
									disabled={$contentDelayed}
								></textarea>
							</Label>
						{/snippet}
					</Control>
					<FieldErrors class="text-error text-sm" />
				</Fieldset>
				<div class="w-full text-end">
					<button type="submit" class="btn btn-sm btn-primary" disabled={$contentDelayed || !todo.title}>
						{#if $contentDelayed}
							<span class="loading loading-spinner loading-sm"></span>
						{/if}
						<Save size={16} />
						<span>Enregistrer</span>
					</button>
				</div>
			</form>
		{:else}
			<div class="flex flex-col gap-4" transition:slide={{ duration: 300 }}>
				<div
					class="flex w-full items-start gap-2"
					class:text-gray-500={todo.isComplete}
					class:line-through={todo.isComplete}
				>
					<h2 class="card-title line-clamp-2 break-all">{todo.title}</h2>
					<div class="w-1/6 pt-1">
						<Pencil size={16} class="text-gray-500" />
					</div>
				</div>
				<p
					class="line-clamp-4 text-sm break-all text-gray-600"
					class:opacity-70={todo.isComplete}
					class:line-through={todo.isComplete}
				>
					{todo?.description}
				</p>
			</div>
		{/if}

		{#if !isEditing}
			<div class="card-actions justify-end">
				<form action="?/deleteTodo" method="POST" use:enhanceDelete>
					<input type="hidden" name="$id" value={todo.$id} />
					<button type="submit" class="btn btn-xs btn-outline btn-error">
						{#if $deleteDelayed}
							<span class="loading loading-spinner loading-sm"></span>
						{:else}
							<Trash size={16} />
						{/if}
					</button>
				</form>
				<form action="?/updateTodoStatus" method="POST" use:enhanceStatus>
					<input type="hidden" name="$id" value={todo.$id} />
					<input type="hidden" name="isComplete" value={!todo.isComplete} />
					<button type="submit" class="btn btn-xs btn-outline">
						{#if $statusDelayed}
							<span class="loading loading-spinner loading-sm"></span>
						{:else if todo.isComplete}
							<Check size={16} />
						{:else}
							<Clock size={16} />
						{/if}
					</button>
				</form>
			</div>
		{/if}
	</div>
</div>
