import {
	SignUpCommand,
	InitiateAuthCommand,
	CognitoIdentityProviderClient
} from '@aws-sdk/client-cognito-identity-provider';

import crypto from 'crypto';
import { USER_POOL_CLIENT_ID, USER_POOL_CLIENT_SECRET } from '$env/static/private';

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
	const client = new CognitoIdentityProviderClient({ region: 'ca-central-1' });
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

	const { Session } = await client.send(signUpCommand);

	const signInCommand = new InitiateAuthCommand({
		AuthFlow: "USER_AUTH",
		Session,
		AuthParameters: {
			USERNAME: email,
			SECRET_HASH: secretHash,
			ChallengeName: 'PASSWORD'
		},
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