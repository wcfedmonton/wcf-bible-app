import type { Cookies } from '@sveltejs/kit';

type TokenArgs = {
	cookieObj: Cookies;
	session: { AccessToken: string | undefined; RefreshToken: string | undefined };
};

/**
 * Saves authentication tokens to cookies with security settings.
 *
 * @param {TokenArgs} options - The token arguments object
 * @param {any} options.cookieObj - The cookie object used to set cookies
 * @param {Object} options.session - The session object containing token data
 * @param {string} options.session.AccessToken - The access token to be saved
 * @param {string} options.session.RefreshToken - The refresh token to be saved
 * @returns {void}
 * @example
 * saveTokens({
 *   cookieObj: cookies,
 *   session: { AccessToken: 'token123', RefreshToken: 'refresh123' }
 * });
 */
export function saveTokens({ cookieObj, session }: TokenArgs) {
	const defaultCookieOptions = {
		path: '/',
		httpOnly: true,
		sameSite: 'strict' as const,
		secure: false, // will be set to true in production. false is used now because of HTTPS protocols
		
	};
	
	cookieObj.set('accessToken', session.AccessToken!, { 
		...defaultCookieOptions,
		maxAge: 60 * 60  
	});

	cookieObj.set('refreshToken', session.RefreshToken!, {
		...defaultCookieOptions,
		maxAge: 60 * 60 * 24 * 30
	});
}
