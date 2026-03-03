import { saveTokens } from '$lib/server/utils.js';
import { getUserInfo } from '$lib/actions/google.js';
import { googleAuthenticate } from '$lib/actions/aws.js';

export async function POST({ url, cookies }): Promise<Response> {
	const code = url.searchParams.get('code')!;
	const { fullName, email } = await getUserInfo(code);
	const session = (await googleAuthenticate(fullName, email))!;

	saveTokens({ cookieObj: cookies, session });

	return new Response(JSON.stringify({ message: '' }));
}
