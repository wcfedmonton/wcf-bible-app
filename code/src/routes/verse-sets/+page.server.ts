import type { VerseSet } from '$lib/utils';

export async function load({ fetch, cookies }) {
	const { sub: userId } = JSON.parse(atob(cookies.get('idToken')!.split('.')[1]));

	const res = await fetch(`api/users/${userId}/sets`);
	const sets: VerseSet[] = await res.json();

	return { data: sets };
}
