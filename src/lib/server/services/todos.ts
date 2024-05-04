import { type Cookies } from '@sveltejs/kit';
import { ID, Query } from 'node-appwrite';
import type { Todo, TodoCreate, TodoUpdate, TodoUpdateStatus } from '$types/todo';
import { AppwriteError, createSessionClient, safeAppwriteRequest } from '$server/appwrite';

const TODO_DB_ID = '67f2e39a0020e96f88a3';
const TODO_COLLECTION_ID = 'todos_collection';

export const TODO_IDS = {
	DATABASE: TODO_DB_ID,
	COLLECTION: TODO_COLLECTION_ID
};

export const createTodoApi = (cookies: Cookies) => {
	const { databases } = createSessionClient(cookies);

	return {
		async getById(id: string): Promise<[Todo | null, AppwriteError | null]> {
			return safeAppwriteRequest(() => databases.getDocument(TODO_IDS.DATABASE, TODO_IDS.COLLECTION, id));
		},

		async getAllForUser(): Promise<[{ total: number; todos: Todo[] } | null, AppwriteError | null]> {
			return safeAppwriteRequest(
				() => databases.listDocuments(TODO_IDS.DATABASE, TODO_IDS.COLLECTION),
				(data) => ({
					todos: data.documents as Todo[],
					total: data.total || 0
				})
			);
		},

		async create(todoData: TodoCreate): Promise<[Todo | null, AppwriteError | null]> {
			return safeAppwriteRequest(() =>
				databases.createDocument(TODO_IDS.DATABASE, TODO_IDS.COLLECTION, ID.unique(), todoData)
			);
		},

		async update(todo: TodoUpdate): Promise<[Todo | null, AppwriteError | null]> {
			const { $id, ...data } = todo;
			return safeAppwriteRequest(() => databases.updateDocument(TODO_IDS.DATABASE, TODO_IDS.COLLECTION, $id, data));
		},

		async delete(id: Todo['$id']): Promise<[boolean | null, AppwriteError | null]> {
			return safeAppwriteRequest(
				() => databases.deleteDocument(TODO_IDS.DATABASE, TODO_IDS.COLLECTION, id),
				() => true
			);
		},

		async switchStatus(todo: TodoUpdateStatus): Promise<[Todo | null, AppwriteError | null]> {
			const { $id, ...data } = todo;
			return safeAppwriteRequest(() => databases.updateDocument(TODO_IDS.DATABASE, TODO_IDS.COLLECTION, $id, data));
		},

		async searchByTitle(title: Todo['title']): Promise<[Todo[] | null, AppwriteError | null]> {
			return safeAppwriteRequest(
				() => databases.listDocuments(TODO_IDS.DATABASE, TODO_IDS.COLLECTION, [Query.search('title', title)]),
				(data) => data.documents as Todo[]
			);
		},

		async getCompleted(): Promise<[Todo[] | null, AppwriteError | null]> {
			return safeAppwriteRequest(
				() => databases.listDocuments(TODO_IDS.DATABASE, TODO_IDS.COLLECTION, [Query.equal('isComplete', true)]),
				(data) => data.documents as Todo[]
			);
		},

		async getIncomplete(): Promise<[Todo[] | null, AppwriteError | null]> {
			return safeAppwriteRequest(
				() => databases.listDocuments(TODO_IDS.DATABASE, TODO_IDS.COLLECTION, [Query.equal('isComplete', false)]),
				(data) => data.documents as Todo[]
			);
		}
	};
};
