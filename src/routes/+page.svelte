<script lang="ts">
	import { Plus, X } from '@lucide/svelte';
	import _ from 'lodash';
	import { toast } from 'svelte-sonner';
	import TodoForm from '$components/todo/TodoForm.svelte';
	import TodoItem from '$components/todo/TodoItem.svelte';
	import type { Todo } from '$types/todo';
	import { i18n } from '$lib/i18n';

	let { data } = $props();

	let todos = $state<Todo[]>(data.todos);
	let isAddingTodo = $state(false);
	let sortedTodos = $derived(_.orderBy(todos, ['$createdAt'], ['desc']));

	const toggleAddTodoForm = () => {
		isAddingTodo = !isAddingTodo;
	};

	const handleTodoCreated = (newTodo: Todo) => {
		todos = [newTodo, ...todos];
		toast.success(i18n['todo.event_created']());
	};

	const handleTodoUpdated = (updatedTodo: Todo) => {
		todos = todos.map((todo) => (todo.$id === updatedTodo.$id ? updatedTodo : todo));
		toast.success(i18n['todo.event_updated']());
	};

	const handleTodoDeleted = (todoId: string) => {
		todos = todos.filter((todo) => todo.$id !== todoId);
		toast.success(i18n['todo.event_deleted']());
	};
</script>

<div class="container mx-auto flex flex-col gap-4 p-4">
	<div class="flex items-center justify-between">
		<h1 class="text-3xl font-bold">{i18n['todo.page_title']()}</h1>
		<button onclick={toggleAddTodoForm} class="btn btn-primary">
			{#if isAddingTodo}
				<X />
			{:else}
				<Plus />
			{/if}
		</button>
	</div>

	{#if isAddingTodo}
		<div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
			<h2 class="text-xl font-semibold">{i18n['todo.new_todo']()}</h2>
			<TodoForm form={data.createTodoForm} onComplete={toggleAddTodoForm} onTodoCreated={handleTodoCreated} />
		</div>
	{/if}

	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
		{#if sortedTodos.length === 0}
			<div class="col-span-full rounded-lg bg-gray-50 p-8 text-center">
				<p class="text-gray-500">{i18n['todo.no_todos']()}</p>
				{#if !isAddingTodo}
					<button onclick={toggleAddTodoForm} class="btn btn-outline btn-sm mt-4">
						{i18n['todo.add_first_todo']()}
					</button>
				{/if}
			</div>
		{:else}
			{#each sortedTodos as todo (todo.$id)}
				<TodoItem {todo} onTodoUpdated={handleTodoUpdated} onTodoDeleted={handleTodoDeleted} />
			{/each}
		{/if}
	</div>
</div>
