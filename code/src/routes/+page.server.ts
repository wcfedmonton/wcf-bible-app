import { fetchChapter } from "$lib/bible/chapterServices";
import type { BibleTranslation } from "$lib/server/bible.js";

export async function load({ fetch }) {
    const data = (await fetchChapter({
        input: "John 1:1",
        verseLimit: 1,
		verseReference: '',
		verseData: [],
		selectedVerseIndex: 0,
		translation: 'NIV',
        fetch
    }))!;

    return {
        ...data,
        translation: 'NIV' as BibleTranslation
	};
}