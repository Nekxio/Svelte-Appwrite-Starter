import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { paraglideMiddleware } from '$lib/paraglide/server';
import { createSessionClient, SESSION_COOKIE } from '$lib/server/appwrite';

const paraglideHandle: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request: localizedRequest, locale }) => {
		event.request = localizedRequest;
		return resolve(event, {
			transformPageChunk: ({ html }) => {
				return html.replace('%lang%', locale);
			}
		});
	});

const sessionHandle: Handle = async ({ event, resolve }) => {
	const sessionCookie = event.cookies.get(SESSION_COOKIE);

	if (sessionCookie) {
		try {
			const { client, account } = createSessionClient(event.cookies);
			client.setSession(sessionCookie);

			event.locals.user = await account.get();
		} catch {
			event.locals.user = undefined;
			event.cookies.delete(SESSION_COOKIE, { path: '/' });
		}
	} else {
		event.locals.user = undefined;
	}

	return resolve(event);
};

const authHandle: Handle = async ({ event, resolve }) => {
	const publicRoutes = ['/auth/login', '/auth/register', '/auth/reset-password', '/auth/verify'];

	const authRoutes = [
		'/auth/verify',
		'/auth/logout',
		'/auth/register',
		'/auth/resend-verification',
		'/auth/register-success'
	];

	const noRedirectRoutes = ['/auth/logout', '/api', '/callback'];

	const isPublicRoute = publicRoutes.some(
		(route) => event.url.pathname === route || event.url.pathname.startsWith(`${route}/`)
	);

	const isAuthRoute = authRoutes.some(
		(route) => event.url.pathname === route || event.url.pathname.startsWith(`${route}/`)
	);

	const isNoRedirectRoute = noRedirectRoutes.some(
		(route) => event.url.pathname === route || event.url.pathname.startsWith(`${route}/`)
	);

	if (!event.locals.user && !isPublicRoute) {
		const redirectPath = isNoRedirectRoute ? '/account' : event.url.pathname;
		throw redirect(302, `/login?redirectTo=${encodeURIComponent(redirectPath)}`);
	}

	if (event.locals.user && !event.locals.user.emailVerification && !isPublicRoute && !isAuthRoute) {
		throw redirect(302, '/auth/verify');
	}

	return resolve(event);
};

export const handle: Handle = sequence(sessionHandle, authHandle, paraglideHandle);
