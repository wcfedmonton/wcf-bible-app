import { GATEWAY_ENDPOINT } from '$env/static/private';

export async function POST({ request, fetch }) {
    fetch(`${GATEWAY_ENDPOINT}/sets`, {
        method: "POST",
        body: JSON.stringify(await request.json())
    });

    return new Response(JSON.stringify({ message: "Set sucessfuly created." }), {
        status: 201,
        headers: {
            "Content-Type": "application/json"
        }
    });
}