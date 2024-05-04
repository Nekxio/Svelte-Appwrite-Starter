import { fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { todoCreateSchema, todoIdSchema, todoUpdateSchema, todoUpdateStatusSchema } from '$types/todo';
import { createTodoApi } from '$server/services/todos';
import { getErrorMessage } from '$utils/errors';
import { i18n } from '$lib/i18n';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	const todoApi = createTodoApi(cookies);
	const [data, err] = await todoApi.getAllForUser();

	if (err) {
		fail(500, { message: err?.translatedErrorMessage ?? i18n.error_messages({ type: 'unknown' }) });
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
			return message(form, getErrorMessage(error.type), { status: 400 });
		}

		return { form, success: true, todo, successMessage: 'Tâche créée avec succès !' };
	},

	updateTodoStatus: async ({ request, cookies }) => {
		const todoApi = createTodoApi(cookies);
		const form = await superValidate(request, zod(todoUpdateStatusSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const [todo, error] = await todoApi.switchStatus(form.data);

		if (error) {
			return message(form, error?.translatedErrorMessage ?? getErrorMessage(error?.type ?? 'unknown_error'), {
				status: 400
			});
		}

		return { form, success: true, todo, successMessage: 'Statut de la tâche mis à jour !' };
	},

	updateTodoContent: async ({ request, cookies }) => {
		const todoApi = createTodoApi(cookies);
		const form = await superValidate(request, zod(todoUpdateSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const [todo, error] = await todoApi.update(form.data);

		if (error) {
			return message(form, error?.translatedErrorMessage ?? getErrorMessage(error?.type ?? 'unknown_error'), {
				status: 400
			});
		}

		return { form, success: true, todo, successMessage: 'Contenu de la tâche modifié !' };
	},

	deleteTodo: async ({ request, cookies }) => {
		const todoApi = createTodoApi(cookies);
		const form = await superValidate(request, zod(todoIdSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const [success, error] = await todoApi.delete(form.data.$id);

		if (error) {
			return message(form, error?.translatedErrorMessage ?? getErrorMessage(error?.type ?? 'unknown_error'), {
				status: 400
			});
		}

		return { form, success, deletedId: form.data.$id, successMessage: 'Tâche supprimée avec succès !' };
	}
} satisfies Actions;
