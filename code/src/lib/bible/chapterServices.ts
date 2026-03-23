import bookMap from '$lib/shared/OSIS.json';
import { parseQuery } from '$lib/shared/format';
import type { OSISReference } from '$lib/shared/format';
import type { BibleTranslation, Verse } from '$lib/server/bible';

type FetchChapterParams = {
	input: string;
	verseData: Verse[];
	verseLimit: number;
	verseReference: string;
	selectedVerseIndex: number;
	translation: BibleTranslation;
	fetch?: typeof globalThis.fetch; // a 'fetch' field is included because a different 'fetch' fn is used on the server
};

/**
 * Fetches and initializes chapter verse data for a parsed Bible reference and selected translation.
 *
 * @param input - A Bible reference string (e.g., "gen 1 1") to be parsed into book and chapter information.
 * @param translation - The selected Bible translation identifier used to fetch the corresponding chapter data.
 */
export async function fetchChapter(options: FetchChapterParams) {
	const osis = parseQuery(options.input)!;
	if (!osis) return;

	const fetchFn = options.fetch ?? fetch;
	let { verseData, verseLimit, verseReference, selectedVerseIndex } = options;

	const params = new URLSearchParams({
		query: `${osis.book}.${osis.chapter}`, // normalize the query to increase cache hits
		translation: options.translation
	});

	const res = await fetchFn(`api/verses?${params.toString()}`);
	const resolved = await res.json();

	verseData = resolved.verses.length === 0 ? verseData : resolved.verses;
	verseLimit = resolved.verses.length === 0 ? verseLimit : resolved.numVerses;
	selectedVerseIndex =
		resolved.verses.length === 0
			? selectedVerseIndex
			: verseData.findIndex((verse) => `${verse.id}` === `${osis.selectedVerse}`);

	// if the verse the user was looking for doesn't exist in the selected translation, default to the first verse
	if(selectedVerseIndex === -1) { 
		selectedVerseIndex = 0;
	}

	verseReference =
		resolved.verses.length === 0
			? verseReference
			: getVerseReference(verseData, osis, selectedVerseIndex);

	return {
		osis,
		verseData,
		verseLimit,
		verseReference,
		selectedVerseIndex
	};
}

/**
 * Fetches a specific verse based on a user query and translation.
 *
 * @param {string} query - A verse query string (e.g., "John 3:16").
 * @param {string} translation - The Bible translation identifier to fetch from the API.
 * @returns {Promise<{ id: number, text: string } | undefined>}
 * A promise resolving to the matching verse object if found, otherwise `undefined`.
 */
export async function fetchVerse(query: string, translation: string) {
	const osis = parseQuery(query)!;

	if (!osis) return;

	const params = new URLSearchParams({
		query: `${osis.book}.${osis.chapter}`, // normalize the query to increase cache hits
		translation: translation
	});

	const res = await fetch(`api/verses?${params.toString()}`);
	const { verses } = await res.json();

	return verses.find((verse: { id: number; text: string }) => verse.id === osis.selectedVerse);
}

/** Resolves and returns a valid selected verse reference.*/
export function getVerseReference(
	verseData: Verse[],
	osis: OSISReference,
	selectedVerseIndex: number
): string {
	const verseNumber = verseData[selectedVerseIndex]?.id ?? verseData[0]?.id;

	return `${bookMap[osis.book as keyof typeof bookMap]} ${osis.chapter}:${verseNumber}`;
}
