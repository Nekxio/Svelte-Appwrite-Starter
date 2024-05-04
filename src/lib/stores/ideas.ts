import type { Idea } from '$types/idea';
import { writable } from 'svelte/store';

const createIdeas = () => {
	const { subscribe, set, update } = writable<Idea[]>([]);

	return {
		subscribe,
		setIdeas: (ideas: Idea[]) => set(ideas),
		addIdea: (newIdea: Idea) =>
			update((ideas) => {
				const existingIdea = ideas.find((idea) => idea.$id === newIdea.$id);
				if (!existingIdea) {
					return [...ideas, newIdea];
				}
				return ideas;
			}),
		deleteIdea: (oldIdeaId: string) => update((ideas: Idea[]) => ideas.filter((idea) => idea.$id !== oldIdeaId))
	};
};

export const ideasStore = createIdeas();
