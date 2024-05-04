import type { Models } from 'node-appwrite';

export type Idea = Partial<Models.Document> & {
	$id: string;
	userId: string;
	title: string;
	description?: string;
};
