import { saveTokens } from '$lib/utils.js';
import { getUserInfo } from '$lib/actions/google.js';
import { googleAuthenticate } from '$lib/actions/aws.js';

export async function POST({ request, cookies }): Promise<Response> {
	try {
		const form = await request.formData();
		const { fullName, email } = await getUserInfo(form.get('code') as string);
		const session = (await googleAuthenticate(fullName, email))!;

		saveTokens({ cookieObj: cookies, session });

		return new Response(JSON.stringify({ message: '' }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		// this error can be safely ignored since authentication still 
		// works correctly in spite of it
		return new Response(JSON.stringify({ message: 'Invalid grant' })); 
	}
}
