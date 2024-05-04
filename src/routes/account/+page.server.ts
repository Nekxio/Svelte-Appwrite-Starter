import { removeUserSession } from '$lib/server/appwrite';
import { addIdea, deleteIdea, getIdeas } from '$lib/server/ideas';
import type { Idea } from '$types/idea';
import { error, type Actions } from '@sveltejs/kit';
import { ID } from 'node-appwrite';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }): Promise<{ ideas: Idea[] }> => {
	const client = locals.client;
	const ideas: Idea[] = client ? await getIdeas(client) : [];

	return {
		ideas
	};
};

export const actions: Actions = {
	logout: async (event) => {
		await removeUserSession(event);
	},
	addIdea: async ({ request, locals }) => {
		if (locals.user) {
			const form = await request.formData();
			const id = ID.unique();
			const userId = locals.user.$id;
			const title = String(form.get('title'));
			const description: string | undefined = String(form.get('description')) || '';
			const client = locals.client;

			const idea: Idea = {
				$id: id,
				userId: userId,
				title: title,
				description: description
			};

			try {
				const newIdea = client && (await addIdea(idea, client));
				return { idea: newIdea };
			} catch (e) {
				typeof e === 'string' && error(500, e);
				e instanceof Error && error(500, e.message);
			}
		}
	},
	deleteIdea: async ({ request, locals }) => {
		const form = await request.formData();
		const ideaId = String(form.get('ideaId'));
		const client = locals.client;

		try {
			client && (await deleteIdea(ideaId, client));
			return { ideaId: ideaId };
		} catch (e) {
			typeof e === 'string' && error(500, e);
			e instanceof Error && error(500, e.message);
		}
	}
};
