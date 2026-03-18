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

	const { name } = JSON.parse(atob(cookies.get('idToken')!.split('.')[1]));

	return {
		name,
		...data,
		translation: 'NIV' as BibleTranslation
	};
}
