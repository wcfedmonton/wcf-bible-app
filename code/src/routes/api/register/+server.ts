import { signUp } from '$lib/actions/aws.js';
import { UsernameExistsException } from '@aws-sdk/client-cognito-identity-provider';

export async function POST({ url }): Promise<Response> {
	const name = url.searchParams.get('name')!;
	const email = url.searchParams.get('email')!;
	const password = url.searchParams.get('password')!;

	let session = '';

	try {
		const { Session } = await signUp({ name, email, password });
		session = Session ?? '';
	} catch (error) {
		if (error instanceof UsernameExistsException) {
			return new Response(JSON.stringify({ error: 'An account with this email already exists.' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}
	}

	return new Response(JSON.stringify({ session }), {
		status: 201,
		headers: { 'Content-Type': 'application/json' }
	});
}
