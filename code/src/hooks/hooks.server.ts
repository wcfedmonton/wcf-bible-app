import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);

	response.headers.set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
	response.headers.set(
		'Content-Security-Policy',
		[
			"default-src 'self'",
			"script-src 'self' 'unsafe-inline' https://accounts.google.com/gsi/client",
			"frame-src 'self' https://accounts.google.com",
			"frame-ancestors 'self' https://accounts.google.com",
			"connect-src 'self' https://accounts.google.com",
			"style-src 'self' 'unsafe-inline' https://accounts.google.com",
			"img-src 'self' data: https://*.googleusercontent.com"
		].join('; ')
	);

	return response;
};
