import { type BibleTranslation, getVerses } from '$lib/server/bible';

export async function GET({ url }): Promise<Response> {
	const query = url.searchParams.get('query')!; // an assertion can safely be used here because query formatting is verfied on the client
	const translation = url.searchParams.get('translation');
	const verses = await getVerses(query, translation as BibleTranslation)!;

	return new Response(JSON.stringify({ verses, numVerses: verses.length }), {
		headers: {
			'Cache-Control': `public, max-age=${3600 * 24 * 30}`
		}
	});
}
