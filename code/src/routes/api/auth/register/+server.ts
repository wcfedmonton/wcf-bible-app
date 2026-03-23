import { register } from '$lib/actions/aws.js';
import { saveTokens } from '$lib/utils.js';
import { UsernameExistsException } from '@aws-sdk/client-cognito-identity-provider';

export async function POST({ request, cookies }): Promise<Response> {
	const form = await request.formData();
	const name = form.get('name') as string;
	const email = form.get('email') as string;
	const password = form.get('password') as string;

	try {
		const session = await register({ name, email, password });
		saveTokens({ cookieObj: cookies, session });
	} catch (error) {
		if (error instanceof UsernameExistsException) {
			return new Response(JSON.stringify({ error: 'An account with this email already exists.' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}
	}

	return new Response(JSON.stringify({ message: 'User successfully created.' }), {
		status: 201,
		headers: { 'Content-Type': 'application/json' }
	});
}
