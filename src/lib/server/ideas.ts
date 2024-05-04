import { STARTER_COLLECTION_ID, STARTER_DATABASE_ID } from '$env/static/private';
import type { Idea } from '$types/idea';
import { error } from '@sveltejs/kit';
import { Databases, Permission, Role, type Client } from 'node-appwrite';

export const getIdeas = async (client: Client): Promise<Idea[]> => {
	try {
		const databases = new Databases(client);

		const ideas = await databases.listDocuments(STARTER_DATABASE_ID, STARTER_COLLECTION_ID);
		return ideas.documents as Idea[];
	} catch (e) {
		typeof e === 'string' && error(500, e);
		e instanceof Error && error(500, e.message);
	}
	return [];
};

export const addIdea = async (idea: Idea, client: Client) => {
	try {
		const databases = new Databases(client);

		return databases.createDocument(
			STARTER_DATABASE_ID,
			STARTER_COLLECTION_ID,
			idea.$id,
			{
				userId: idea.userId,
				title: idea.title,
				description: idea.description
			},
			[
				Permission.read(Role.user(idea.userId)),
				Permission.update(Role.user(idea.userId)),
				Permission.delete(Role.user(idea.userId))
			]
		);
	} catch (e) {
		typeof e === 'string' && error(500, e);
		e instanceof Error && error(500, e.message);
	}
};

export const deleteIdea = async (id: string, client: Client) => {
	try {
		const databases = new Databases(client);

		return databases.deleteDocument(STARTER_DATABASE_ID, STARTER_COLLECTION_ID, id);
	} catch (e) {
		typeof e === 'string' && error(500, e);
		e instanceof Error && error(500, e.message);
	}
};
