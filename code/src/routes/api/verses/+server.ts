import { type BibleTranslation, getVerses } from '$lib/server/bible';

export async function GET({ url }): Promise<Response> {
	const query = url.searchParams.get('query')!; // an assertion can safely be used here because queries verfied on the client
	const translation = url.searchParams.get('translation');
	const verses = await getVerses(query, translation as BibleTranslation)!;

	if (verses.length === 0) return new Response('Invalid query', { status: 400 });

	return new Response(JSON.stringify({ verses, numVerses: verses.length }), {
		headers: {
			'Cache-Control': `public, max-age=${3600 * 24 * 30}`
		}
	});
}
