import { Models } from 'node-appwrite';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?: Models.User<Models.Preferences>;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
