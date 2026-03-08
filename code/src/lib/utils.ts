import type { Cookies } from '@sveltejs/kit';
import YVTranslations from '$lib/shared/YVTranslations.json' with { type: 'json' };
import APIBibleTranslations from '$lib/shared/APIBibleTranslations.json' with { type: 'json' };

export type FormState = {
	full_name?: string;
	email: string;
	password: string;
	loading?: boolean;
};

/**
 * Determines whether a form submission should be disabled based on the current form state.
 *
 * @param {FormState} state - The current state of the form containing validation and submission information
 * @returns {boolean} True if the form submission should be disabled, false otherwise
 */
export function disabledCondition(state: FormState) {
	const invalidEmail = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email);
	const emptyField = Object.values(state).some((field) => field === '');

	// the existence of the full_name field is used to verify whether or not the password length
	// should be verified -- it's verified on the sign up page, but not the sign in page
	return (
		invalidEmail ||
		emptyField ||
		(state.full_name ? state.password.length < 8 : false) ||
		state.loading
	);
}

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
		secure: false // will be set to true in production. false is used now because of HTTPS protocols
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

export type Verse = {
	text: string;
	translation: string;
	verseReference: string;
};

export type VerseSet = {
	id: string;
	name: string;
	verses: Verse[];
	lastEdited: string;
};

export type ContextValue<T> = {
	value: T;
};

/**
 * Gets the current date formatted as a readable string.
 *
 * @returns {string} The current date in "Mon D, YYYY" format (e.g. "Mar 7, 2026")
 */
export function getDate() {
	const date = new Date();
	const [month, day, year] = date.toDateString().split(' ').slice(1);

	return `${month} ${Number(day)}, ${year}`
}

/**
 * Gets a sorted, deduplicated list of all available Bible translations
 * from both YouVersion and API Bible sources.
 *
 * @returns {string[]} Sorted array of unique translation keys
 */
export function getTranslations() {
	const translations = [
		...new Set([...Object.keys(YVTranslations), ...Object.keys(APIBibleTranslations)])
	].sort();

	return translations;
}
