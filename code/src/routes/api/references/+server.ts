import { getSearchResults } from 'biblesdk';
import USFM from '$lib/shared/USFM.json' with { type: 'json' };

export async function GET({ url }): Promise<Response> {
	const query = url.searchParams.get('query')!;
	const suggestions = await getResults(query);

	return new Response(JSON.stringify({ suggestions }));
}

/**
 * Accepts a phrase (or partial phrase) from a verse, performs a search,
 * and returns an the biblical references of verses that match the phrase.
 */
async function getResults(query: string) {
	if (!query) return [];

	const suggestions: string[] = [];
	const results = await getSearchResults(query);

	results.forEach((result) => {
		const resultUSFM = result.book;
		const bookName = Object.entries(USFM).find(([, USFM]) => USFM === resultUSFM)![0];

		suggestions.push(`${bookName} ${result.chapter}:${result.verse}`);
	});

	return suggestions;
}
