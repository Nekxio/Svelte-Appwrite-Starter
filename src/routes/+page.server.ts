import { error, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { todoCreateSchema, todoIdSchema, todoUpdateSchema, todoUpdateStatusSchema } from '$types/todo';
import { createTodoApi } from '$server/services/todos';
import { extractErrorMessage } from '$utils/errors';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	const todoApi = createTodoApi(cookies);
	const [data, err] = await todoApi.getAllForUser();

	if (err) {
		throw error(500, { message: extractErrorMessage(err) });
	}

	return {
		todos: data?.todos || [],
		total: data?.total || 0,
		createTodoForm: await superValidate(zod(todoCreateSchema)),
		updateTodoForm: await superValidate(zod(todoUpdateStatusSchema))
	};
};

export const actions: Actions = {
	createTodo: async ({ request, cookies }) => {
		const todoApi = createTodoApi(cookies);
		const form = await superValidate(request, zod(todoCreateSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const [todo, error] = await todoApi.create(form.data);

		if (error) {
			return fail(error.code || 500, {
				form,
				error: extractErrorMessage(error)
			});
		}

		return { form, success: true, todo };
	},
	updateTodoStatus: async ({ request, cookies }) => {
		const todoApi = createTodoApi(cookies);
		const form = await superValidate(request, zod(todoUpdateStatusSchema));

		if (!form.valid) {
			return fail(400, { form });
		}
		const [todo, error] = await todoApi.switchStatus(form.data);

		if (error) {
			return fail(error.code || 500, {
				form,
				error: extractErrorMessage(error)
			});
		}

		return { form, success: true, todo };
	},

	updateTodoContent: async ({ request, cookies }) => {
		const todoApi = createTodoApi(cookies);
		const form = await superValidate(request, zod(todoUpdateSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const [todo, error] = await todoApi.update(form.data);

		if (error) {
			return fail(error.code || 500, {
				form,
				error: extractErrorMessage(error)
			});
		}

		return { form, success: true, todo };
	},

	deleteTodo: async ({ request, cookies }) => {
		const todoApi = createTodoApi(cookies);
		const form = await superValidate(request, zod(todoIdSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const [success, error] = await todoApi.delete(form.data.$id);

		if (error) {
			return fail(error.code || 500, {
				form,
				error: extractErrorMessage(error)
			});
		}

		return {
			form,
			success,
			deletedId: form.data.$id
		};
	}
} satisfies Actions;
