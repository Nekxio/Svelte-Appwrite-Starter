import { ideasStore } from '$stores/ideas';
import type { Idea } from '$types/idea';
import { get } from 'svelte/store';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data }) => {
	const ideas: Idea[] = get(ideasStore);
	!ideas.length && ideasStore.setIdeas(data.ideas);
};
