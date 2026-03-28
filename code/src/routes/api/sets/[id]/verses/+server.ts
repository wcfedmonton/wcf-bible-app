import { GATEWAY_ENDPOINT } from '$env/static/private';

export async function POST({ request, fetch }) {
	const body = await request.json();

	await fetch(`${GATEWAY_ENDPOINT}/sets/${body.item.verseSetId}/verses`, {
		method: 'POST',
		body: JSON.stringify(body)
	});

	return new Response(JSON.stringify({ message: 'Verse added to set successfully.' }), {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
}

export async function DELETE({ request, fetch }) {
	const body = await request.json();

	await fetch(`${GATEWAY_ENDPOINT}/sets/${body.item.verseSetId}/verses`, {
		method: 'DELETE',
		body: JSON.stringify({
			item: { verseSetId: body.item.verseSetId, verseReference: body.item.verseReference },
			tableName: body.tableName
		})
	});

	return new Response(JSON.stringify({ message: 'Verse deleted successfully.' }), {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
