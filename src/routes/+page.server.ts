import type { PageServerLoad } from './$types';
export const load: PageServerLoad = (): { title: string } => {
	return {
		title: 'Start a new project with Svelte'
	};
};
