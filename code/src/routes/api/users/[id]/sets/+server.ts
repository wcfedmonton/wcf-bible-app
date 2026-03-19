import type { VerseSet } from '$lib/utils.js';
import { GATEWAY_ENDPOINT } from '$env/static/private';

export async function GET({ request, cookies }) {
	const userId = request.url.split('/')[5];

	const res = await fetch(`${GATEWAY_ENDPOINT}/users/${userId}/sets`, {
		method: 'GET',
		headers: {
			Authorization: cookies.get('idToken')!
		}
	});

	const sets: VerseSet[] = await res.json();

	return new Response(JSON.stringify(sets), {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
