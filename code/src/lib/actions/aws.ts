import {
	SignUpCommand,
	InitiateAuthCommand,
	AdminInitiateAuthCommand,
	CognitoIdentityProviderClient
} from '@aws-sdk/client-cognito-identity-provider';

import crypto from 'crypto';
import {
	USER_POOL_ID,
	_AWS_ACCESS_KEY,
	_AWS_SECRET_KEY,
	USER_POOL_CLIENT_ID,
	USER_POOL_CLIENT_SECRET,
	GOOGLE_DEFAULT_PASSWORD
} from '$env/static/private';

const client = new CognitoIdentityProviderClient({
	region: 'ca-central-1',
	credentials: {
		accessKeyId: _AWS_ACCESS_KEY,
		secretAccessKey: _AWS_SECRET_KEY
	}
});

/**
 * Registers a new user with AWS Cognito and initiates authentication.
 *
 * Creates a new user account with the provided credentials, then performs
 * the initial authentication flow to obtain access, refresh, and ID tokens.
 *
 * @param {Object} credentials - The user registration credentials
 * @param {string} credentials.name - The user's full name
 * @param {string} credentials.email - The user's email address (used as username)
 * @param {string} credentials.password - The user's password
 *
 * @returns {Promise<{AccessToken: string, RefreshToken: string}>}
 * Authentication tokens for the newly registered user
 *
 * @throws {Error} If SignUp or authentication fails
 */
export async function register({
	name,
	email,
	password
}: {
	name: string;
	email: string;
	password: string;
}) {
	const baseCommandInput = {
		Username: email,
		ClientId: USER_POOL_CLIENT_ID,
		SecretHash: computeSecretHash(email)
	};

	const signUpCommand = new SignUpCommand({
		...baseCommandInput,
		Password: password,
		UserAttributes: [
			{ Name: 'name', Value: name },
			{ Name: 'email', Value: email }
		]
	});

	await client.send(signUpCommand);
	return getTokens(email, password);
}

/**
 * Authenticates a user with AWS Cognito and retrieves authentication tokens.
 *
 * @param email - The user's email address (used as USERNAME for authentication)
 * @param password - Password for the authentication attempt.
 *
 * @returns A promise that resolves to an object containing:
 *   - AccessToken: JWT token for accessing protected resources
 *   - RefreshToken: Token used to refresh the AccessToken when it expires
 *
 * @throws Will throw an error if the authentication request fails or if the response lacks AuthenticationResult
 *
 * @example
 * ```typescript
 * const tokens = await getTokens('user@example.com', 'secret123', 'password123');
 * console.log(tokens.AccessToken); // JWT access token
 * ```
 */
export async function getTokens(email: string, password: string) {
	const authParams = {
		USERNAME: email,
		PASSWORD: password,
		SECRET_HASH: computeSecretHash(email)
	};

	const signInCommand = new InitiateAuthCommand({
		AuthParameters: authParams,
		AuthFlow: 'USER_PASSWORD_AUTH',
		ClientId: USER_POOL_CLIENT_ID
	});

	const { AuthenticationResult } = await client.send(signInCommand)!;
	const { AccessToken, RefreshToken, IdToken } = AuthenticationResult!;

	return { AccessToken, RefreshToken, IdToken };
}

/**
 * Computes the SECRET_HASH required for AWS Cognito API requests.
 *
 * Generates an HMAC-SHA256 hash of the concatenated username and client ID,
 * using the Cognito client secret as the key. This hash is required for
 * authentication operations with Cognito client secrets.
 *
 * @param {string} username - The username to hash
 *
 * @returns {string} Base64-encoded HMAC-SHA256 hash
 */
function computeSecretHash(username: string) {
	return crypto
		.createHmac('SHA256', USER_POOL_CLIENT_SECRET)
		.update(username + USER_POOL_CLIENT_ID)
		.digest('base64');
}

/**
 * Registers a user using a Google-based flow or falls back to Cognito custom authentication
 * if the email used in the Google auth flow already exists in the system.
 *
 * @param {string} email - The user's email address.
 * @param {string} fullName - The user's full name.
 *
 * @returns {Promise<{
 *   AccessToken: string;
 *   RefreshToken: string;
 * }>} An object containing the Cognito access and refresh tokens.
 */
export async function googleAuthenticate(fullName: string, email: string) {
	try {
		const { AccessToken, RefreshToken, IdToken } = await register({
			email,
			name: fullName,
			// we set a default because of Amazon's API requirements, but the user will be
			// to change it through the forgot-password option if they ever decide to use the
			// email-password auth flow
			password: GOOGLE_DEFAULT_PASSWORD
		});

		return { AccessToken: AccessToken!, RefreshToken: RefreshToken!, IdToken: IdToken! };
	} catch {
		// the admin version version of InitiateAuth must be used otherwise the custom
		// auth flow is disabled
		const command = new AdminInitiateAuthCommand({
			AuthFlow: 'CUSTOM_AUTH',
			UserPoolId: USER_POOL_ID,
			ClientId: USER_POOL_CLIENT_ID,
			AuthParameters: {
				USERNAME: email,
				SECRET_HASH: computeSecretHash(email)
			}
		});

		const { AuthenticationResult } = (await client.send(command))!;
		const { AccessToken, RefreshToken, IdToken } = AuthenticationResult!;

		return { AccessToken, RefreshToken, IdToken };
	}
}
