import {
	SignUpCommand,
	InitiateAuthCommand,
	CognitoIdentityProviderClient
} from '@aws-sdk/client-cognito-identity-provider';

import crypto from 'crypto';
import {
	USER_POOL_CLIENT_ID,
	USER_POOL_CLIENT_SECRET,
	GOOGLE_DEFAULT_PASSWORD
} from '$env/static/private';

const client = new CognitoIdentityProviderClient({ region: 'ca-central-1' });

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
 * @returns {Promise<{AccessToken: string, RefreshToken: string, IdToken: string}>}
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
	const secretHash = computeSecretHash(email, USER_POOL_CLIENT_ID, USER_POOL_CLIENT_SECRET);
	const baseCommandInput = {
		ClientId: USER_POOL_CLIENT_ID,
		SecretHash: secretHash,
		Username: email
	};

	const signUpCommand = new SignUpCommand({
		...baseCommandInput,
		Password: password,
		UserAttributes: [
			{ Name: 'email', Value: email },
			{ Name: 'name', Value: name }
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
	const secretHash = computeSecretHash(email, USER_POOL_CLIENT_ID, USER_POOL_CLIENT_SECRET);

	const authParams = {
		USERNAME: email,
		PASSWORD: password,
		SECRET_HASH: secretHash
	};

	const signInCommand = new InitiateAuthCommand({
		AuthFlow: 'USER_PASSWORD_AUTH',
		AuthParameters: authParams,
		ClientId: USER_POOL_CLIENT_ID
	});

	const { AuthenticationResult } = await client.send(signInCommand)!;
	const { AccessToken, RefreshToken } = AuthenticationResult!;

	return { AccessToken, RefreshToken };
}

/**
 * Computes the SECRET_HASH required for AWS Cognito API requests.
 *
 * Generates an HMAC-SHA256 hash of the concatenated username and client ID,
 * using the Cognito client secret as the key. This hash is required for
 * authentication operations with Cognito client secrets.
 *
 * @param {string} username - The username to hash
 * @param {string} clientId - The Cognito app client ID
 * @param {string} clientSecret - The Cognito app client secret
 *
 * @returns {string} Base64-encoded HMAC-SHA256 hash
 */
function computeSecretHash(username: string, clientId: string, clientSecret: string) {
	return crypto
		.createHmac('SHA256', clientSecret)
		.update(username + clientId)
		.digest('base64');
}

export async function googleAuthenticate(fullName: string, email: string) {
	try {
		const { AccessToken, RefreshToken } = await register({
			name: fullName,
			email,
			// we set a default because of Amazon's API requirements, but the user will be
			// to change it through the forgot-password option if they ever decide to use the
			// email-password auth flow
			password: GOOGLE_DEFAULT_PASSWORD
		});

		return { AccessToken: AccessToken!, RefreshToken: RefreshToken! };
	} catch (error) {
		// if error is thrown, then the user exists
		// behaviour to handle this case will be implemented in another issue
		// USER_AUTH flow will be used since there won't be a password
		console.log(error);
	}
}
