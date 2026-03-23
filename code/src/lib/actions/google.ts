import { google } from 'googleapis';

import { GOOGLE_CLIENT_SECRET } from '$env/static/private';
import { PUBLIC_GOOGLE_CLIENT_ID, PUBLIC_DOMAIN } from '$env/static/public';

/**
 * Creates and returns an OAuth2 client configured with Google authentication credentials.
 *
 * @returns {google.auth.OAuth2} A new OAuth2 client instance with Google API credentials and redirect URI.
 */
function getOauth2Client() {
	return new google.auth.OAuth2({
		client_id: PUBLIC_GOOGLE_CLIENT_ID,
		client_secret: GOOGLE_CLIENT_SECRET,
		redirect_uris: [`${PUBLIC_DOMAIN}/register/callback`]
	});
}

/**
 * Exchanges a Google authorization code for an ID token.
 *
 * @param authCode - The authorization code received from Google's OAuth 2.0 authentication flow
 * @returns A promise that resolves to the ID token string
 * @throws Will throw an error if the token exchange fails
 */
async function getIdToken(authCode: string) {
	const oauth2Client = getOauth2Client();
	const {
		tokens: { id_token }
	} = await oauth2Client.getToken(authCode);

	return id_token;
}

/**
 * Retrieves user email and name information from a Google authentication code.
 *
 * @param authCode - The authorization code received from Google OAuth2 flow
 * @returns A promise that resolves to an object containing the user's full name and email
 * @throws Will throw an error if the ID token verification fails or if the authorization code is invalid
 * @example
 * const userInfo = await getUserEmail(authCode);
 * console.log(userInfo.email); // user@gmail.com
 */
export async function getUserInfo(authCode: string) {
	const idToken = (await getIdToken(authCode))!;
	const client = getOauth2Client();

	const ticket = (
		await client.verifyIdToken({
			idToken,
			audience: PUBLIC_GOOGLE_CLIENT_ID
		})
	).getPayload()!;

	const { given_name, family_name, email } = ticket;

	return { fullName: `${given_name} ${family_name}`, email: email! };
}
