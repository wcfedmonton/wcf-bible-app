import { GATEWAY_ENDPOINT } from '$env/static/private';

export async function DELETE({ request, fetch }) {
	const body = await request.json();

	await fetch(`${GATEWAY_ENDPOINT}/sets/${body.item.id}`, {
		method: 'DELETE',
		body: JSON.stringify(body)
	});

	return new Response(JSON.stringify({ message: 'Set deleted sucessfully.' }), {
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
}
