import { GATEWAY_ENDPOINT } from '$env/static/private';

export async function PUT({ request, fetch }) {
    const body = await request.json();
    
    fetch(`${GATEWAY_ENDPOINT}/sets/${body.item.id}`, {
        method: "PUT",
        body: JSON.stringify(body)
    });

    return new Response(JSON.stringify({ message: "Set updated sucessfully." }), {
        status: 200,
        headers: {
            "Content-Type": "application/json"
        }
    });
}

export async function DELETE({ request, fetch }) {
    const body = await request.json();

    fetch(`${GATEWAY_ENDPOINT}/sets/${body.item.id}`, {
        method: "DELETE",
        body: JSON.stringify(body)
    });

    return new Response(JSON.stringify({ message: "Set deleted sucessfully." }), {
        status: 200,
        headers: {
            "Content-Type": "application/json"
        }
    });
}