import { register } from '$lib/actions/aws.js';
import { saveTokens } from '$lib/server/utils.js';
import { UsernameExistsException } from '@aws-sdk/client-cognito-identity-provider';

export async function POST({ url, cookies }): Promise<Response> {
	const name = url.searchParams.get('name')!;
	const email = url.searchParams.get('email')!;
	const password = url.searchParams.get('password')!;

	let session: {
		AccessToken: string | undefined;
		RefreshToken: string | undefined;
	} = { AccessToken: '', RefreshToken: '' };

	try {
		session = await register({ name, email, password });
	} catch (error) {
		if (error instanceof UsernameExistsException) {
			return new Response(JSON.stringify({ error: 'An account with this email already exists.' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}
	}

	saveTokens({ cookieObj: cookies, session });

	return new Response(JSON.stringify({ message: 'User successfully created.' }), {
		status: 201,
		headers: { 'Content-Type': 'application/json' }
	});
}
