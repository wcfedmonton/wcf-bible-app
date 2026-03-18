import type { VerseSet } from '$lib/utils.js';
import { fetchChapter } from '$lib/bible/chapterServices';
import type { BibleTranslation } from '$lib/server/bible.js';

export async function load({ fetch, cookies }) {
	const data = (await fetchChapter({
		input: 'John 1:1',
		verseLimit: 1,
		verseReference: '',
		verseData: [],
		selectedVerseIndex: 0,
		translation: 'NIV',
		fetch
	}))!;

	const { name, sub: userId } = cookies.get('idToken') ? JSON.parse(atob(cookies.get('idToken')!.split('.')[1])) : "";
	
	const res = await fetch(`api/users/${userId}/sets`);
	const sets: VerseSet[] = await res.json();

	return {
		name,
		sets,
		...data,
		translation: 'NIV' as BibleTranslation
	};
}