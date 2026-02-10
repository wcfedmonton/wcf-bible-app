import { ApiClient, BibleClient } from '@youversion/platform-core';
import { YVP_APP_KEY, API_BIBLE_APP_KEY } from '$env/static/private';

import { parseQuery, getUSFMReferences, type OSISReference } from '$lib/shared/format';

import YVTranslationsMap from './YVTranslations.json' with { type: 'json' };
import APIBibleTranslationsMap from './APIBibleTranslations.json' with { type: 'json' };

export type BibleTranslation =
	| keyof typeof YVTranslationsMap
	| keyof typeof APIBibleTranslationsMap;

export type Verse = {
	text: string;
};

/**
 * Fetches verses for a biblical reference.
 *
 * @param {string} query - A user-provided biblical reference (e.g. "John 3:16", "Psalm 23").
 * @param {BibleTranslation} translation - A key from `YVTranslationsMap` specifying the
 *   target translation to query (see `YVTranslationsMap`).
 * @returns {Promise<Verse[]>} Resolves to an array of `Verse` objects: `{ verse: number, text: string }`.
 *   Verse numbers in the returned array are 1-based and correspond to their position in the chapter.
 * @throws {Error} May throw if the underlying YouVersion API calls fail (network, auth, or API errors).
 *
 * @example
 * const verses = await getVerses("Genesis 1:1", "NIV");
 * // => [{ verse: 1, text: 'In the beginning...' }, ...]
 */
export async function getVerses(query: string, translation: BibleTranslation) {
	if (!query) return [];

	const osis = parseQuery(query);

	if (!osis) return [];

	return translation in YVTranslationsMap
		? queryYVP(osis, translation)
		: queryAPIBible(osis, translation);
}

/**
 * Queries the YouVersion Platform API to fetch verses for a biblical reference.
 *
 * @param {OSISReference} osis - An OSIS-formatted biblical reference containing book, chapter, verse count, and selected verse
 * @param {BibleTranslation} translation - A key from `YVTranslationsMap` specifying the YouVersion translation ID to query
 * @returns {Promise<Verse[]>} Resolves to an array of `Verse` objects containing verse numbers (1-based) and text content
 * @throws {Error} May throw if the YouVersion Platform API calls fail (network errors, authentication issues, or API errors)
 *
 * @example
 * const osis = { book: "JHN", chapter: 3, numVerses: 36, selectedVerse: 15 };
 * const verses = await queryYVP(osis, "NIV");
 * // => [{ verse: 1, text: "..." }, { verse: 2, text: "..." }, ...]
 */
async function queryYVP(osis: OSISReference, translation: BibleTranslation) {
	const apiClient = new ApiClient({ appKey: YVP_APP_KEY });
	const bibleClient = new BibleClient(apiClient);
	const bibleId = YVTranslationsMap[translation as keyof typeof YVTranslationsMap];

	type YVPVerseResponse = {
		content: string;
	};

	// prepare API requests
	const verseRequests: Promise<YVPVerseResponse>[] = [];
	const verseReferences = getUSFMReferences(osis);
	verseReferences.forEach((usfmReference) => {
		verseRequests.push(bibleClient.getPassage(bibleId, usfmReference, 'text'));
	});

	const responses = await Promise.all(verseRequests); // use parallel processing to optimize for speed
	const verses: Verse[] = Array.from({ length: responses.length }, (_, i) => ({
		text: responses[i].content
	})).filter((v) => v.text !== undefined);

	return verses;
}

/**
 * Queries the API.Bible service to fetch verses for a biblical reference.
 *
 * @param {OSISReference} osis - An OSIS-formatted biblical reference containing book, chapter, verse count, and selected verse
 * @param {BibleTranslation} translation - A key from `APIBibleTranslationsMap` specifying the API.Bible translation ID to query
 * @returns {Promise<Verse[]>} Resolves to an array of `Verse` objects containing verse numbers (1-based) and processed text content
 * @throws {Error} May throw if the API.Bible request fails (network errors, authentication issues, invalid verse range, or API errors)
 *
 * @example
 * const osis = { book: "JHN", chapter: 3, numVerses: 36, selectedVerse: 15 };
 * const verses = await queryAPIBible(osis, "t_web2ed1nt_tb");
 * // => [{ verse: 1, text: "..." }, { verse: 2, text: "..." }, ...]
 *
 */
async function queryAPIBible(osis: OSISReference, translation: BibleTranslation) {
	const verseReferences = getUSFMReferences(osis);
	const verseRange = `${verseReferences[0]}-${verseReferences[osis.numVerses - 1]}`;
	const bibleId: string =
		APIBibleTranslationsMap[translation as keyof typeof APIBibleTranslationsMap];

	// make request to API
	const queryParams =
		'content-type=json&include-notes=false&include-titles=false' +
		'&include-chapter-numbers=false&include-verse-numbers=false' +
		'&include-verse-spans=false&use-org-id=false';
	const requestUrl = `https://rest.api.bible/v1/bibles/${bibleId}/passages/${verseRange}?${queryParams}`;

	const res = await fetch(requestUrl, {
		headers: {
			'api-key': API_BIBLE_APP_KEY,
			accept: 'application/json'
		}
	});
	const resolved = (await res.json()).data.content;

	// parse each 'verse' object in the verse response
	const verseTextMap = Object.fromEntries(verseReferences.map((key) => [key, '']));
	resolved.forEach((verseObj: { items: VerseItem[] }) =>
		processVerseObject(verseObj, verseTextMap)
	);
	const verses: Verse[] = Array.from({ length: Object.keys(verseTextMap).length }, (_, i) => ({
		text: verseTextMap[verseReferences[i]]
	})).filter((v) => v.text !== 'undefined');

	return verses;
}

type VerseInfo = {
	attrs: {
		verseId: string;
	};
	text: string;
};

type TagVerseItem = {
	type: 'tag';
	items: VerseInfo[];
	text: string;
};

type TextVerseItem = {
	type?: undefined;
	attrs: {
		verseId: string;
	};
	text: string;
};

type VerseItem = TagVerseItem | TextVerseItem;

/**
 * Processes a single verse object from the API.Bible response and updates the verse text map.
 *
 * @param {Record<string, VerseItem[]>} verseObj - A verse object from the API.Bible response containing items with verse data
 * @param {Record<string, string>} verseTextMap - An object mapping USFM verse references to their text content. Updated in-place.
 * @returns {void}
 *
 * @example
 * const verseTextMap = { "GEN.1.1": "" };
 * const verseObj = { items: [{ type: "tag", items: [...] }] };
 * processVerseObject(verseObj, verseTextMap);
 * // verseTextMap["GEN.1.1"] is now populated with processed verse text
 *
 */
function processVerseObject(
	verseObj: { items: VerseItem[] },
	verseTextMap: Record<string, string>
) {
	verseObj.items.forEach((item) => {
		if (item.type === 'tag') {
			// tags must be handled differently since they're stored individually
			const verseId = item.items[0].attrs.verseId;

			// concatenate all subItem texts as-is
			item.items.forEach((subItem: VerseItem) => {
				verseTextMap[verseId] = (verseTextMap[verseId] || '') + subItem.text;
			});

			// insert newline before any capitalized word (except at start)
			verseTextMap[verseId] = verseTextMap[verseId]!.replace(/([^\n])([A-Z])/g, '$1\n$2') // add newline before any capital
				.trim();

			verseTextMap[verseId] = verseTextMap[verseId]
				.replace(/\n/g, ' ') // replace all newline characters (\n) with a single space
				.replace(/\s+/g, ' ') // collapse multiple consecutive whitespace characters (spaces, tabs, etc.) into a single space
				.replace(/\s+,/g, ',') // remove any whitespace **before a comma**, leaving just the comma
				.trim();
		} else {
			const verseId = item.attrs.verseId;
			const lastChar = verseTextMap[verseId][verseTextMap[verseId].length - 1];

			let text = verseTextMap[verseId] + (lastChar === ' ' ? '' : ' ') + item.text; // verify the last added phrase ends with a space
			text = text.replace(/\s+,/g, ','); // remove spaces before commas
			verseTextMap[verseId] = text;
		}
	});
}
