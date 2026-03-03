import {
	SignUpCommand,
	InitiateAuthCommand,
	CognitoIdentityProviderClient
} from '@aws-sdk/client-cognito-identity-provider';

import crypto from 'crypto';
import { USER_POOL_CLIENT_ID, USER_POOL_CLIENT_SECRET } from '$env/static/private';

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

function computeSecretHash(username: string, clientId: string, clientSecret: string) {
	return crypto
		.createHmac('SHA256', clientSecret)
		.update(username + clientId)
		.digest('base64');
}