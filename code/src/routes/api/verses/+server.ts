import { parseQuery } from '$lib/shared/format.js';
import { type BibleTranslation, getVerses } from '$lib/server/bible';

export async function GET({ url }): Promise<Response> {
	const query = url.searchParams.get('query');
	const translation = url.searchParams.get('translation');

	if (!query || !translation) return new Response('Missing query', { status: 400 });

	const cacheLife = 3600 * 24 * 30;
	const { selectedVerse, numVerses } = parseQuery(query) ?? {};
	const verses = await getVerses(query, translation as BibleTranslation)!;

	if (verses.length === 0) return new Response('Invalid query', { status: 400 });

	return new Response(JSON.stringify({ verses, selectedVerse, numVerses }), {
		headers: {
			'Cache-Control': `public, max-age=${cacheLife}`
		}
	});
}
