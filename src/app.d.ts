import { Models, type Client } from 'node-appwrite';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: Models.User<Models.Preferences> | undefined;
			client: Client | undefined;
		} // interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
