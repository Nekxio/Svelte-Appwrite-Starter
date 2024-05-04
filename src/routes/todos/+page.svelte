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

	const handleTodoCreated = (newTodo: Todo, message: string) => {
		todos = [newTodo, ...todos];
		toast.success(message);
	};

	const handleTodoUpdated = (updatedTodo: Todo, message: string) => {
		todos = todos.map((todo) => (todo.$id === updatedTodo.$id ? updatedTodo : todo));
		toast.success(message);
	};

	const handleTodoDeleted = (todoId: string, message: string) => {
		todos = todos.filter((todo) => todo.$id !== todoId);
		toast.success(message);
	};
</script>

<div class="flex flex-col gap-4">
	<div class="relative flex items-center justify-between">
		<h1 class="text-3xl font-bold">{i18n['todo.page_title']()}</h1>
		<div class="relative">
			<button onclick={toggleAddTodoForm} class="btn btn-primary">
				{#if isAddingTodo}
					<X />
				{:else}
					<Plus />
				{/if}
			</button>
			{#if isAddingTodo}
				<div class="absolute right-0 z-20 mt-2 flex flex-col items-end md:right-0 md:left-auto md:translate-x-0">
					<div class="w-lg max-w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
						<h2 class="text-xl font-semibold">{i18n['todo.new_todo']()}</h2>
						<TodoForm form={data.createTodoForm} onComplete={toggleAddTodoForm} onTodoCreated={handleTodoCreated} />
					</div>
				</div>
			{/if}
		</div>
	</div>

	{#if sortedTodos.length === 0 && !isAddingTodo}
		<div class="flex w-full items-center justify-center">
			<div class="w-fit rounded-lg bg-gray-50 p-8 text-center">
				<p class="text-gray-500">{i18n['todo.no_todos']()}</p>
				<button onclick={toggleAddTodoForm} class="btn btn-outline btn-sm mt-4">
					{i18n['todo.add_first_todo']()}
				</button>
			</div>
		</div>
	{:else}
		<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			{#each sortedTodos as todo (todo.$id)}
				<TodoItem {todo} onTodoUpdated={handleTodoUpdated} onTodoDeleted={handleTodoDeleted} />
			{/each}
		</div>
	{/if}
</div>
