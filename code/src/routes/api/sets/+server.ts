import { putItem } from '$lib/actions/dynamo.js';

export async function POST({ request }) {
    await putItem("VerseSets", await request.json());

    return new Response(JSON.stringify({ message: "Set sucessfuly created." }), {
        status: 201,
        headers: {
            "Content-Type": "application/json"
        }
    });
}