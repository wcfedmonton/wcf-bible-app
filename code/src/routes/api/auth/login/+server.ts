import { getTokens } from '$lib/actions/aws.js';
import { saveTokens } from '$lib/utils.js';
import { NotAuthorizedException } from '@aws-sdk/client-cognito-identity-provider';

export async function POST({ request, cookies }) {
	const form = await request.formData();
	const email = form.get('email') as string;
	const password = form.get('password') as string;

	/*try {
		const session = await getTokens(email, password);
		saveTokens({ cookieObj: cookies, session });
	} catch (error) {
		if (error instanceof NotAuthorizedException) {
			return new Response(JSON.stringify({ message: 'Incorrect credentials provided' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}
	}*/

	return new Response(JSON.stringify({ message: 'User succesfully signed in.' }), {
		status: 201,
		headers: { 'Content-Type': 'application/json' }
	});
}
