import { putItem, deleteItem } from '$lib/actions/dynamo.js';

export async function PUT({ request }) {
    putItem("VerseSets", await request.json())

    return new Response(JSON.stringify({ message: "Set updated sucessfully." }), {
        status: 200,
        headers: {
            "Content-Type": "application/json"
        }
    });
}

export async function DELETE({ request }) {
    deleteItem("VerseSets", await request.json())

    return new Response(JSON.stringify({ message: "Set deleted sucessfully." }), {
        status: 200,
        headers: {
            "Content-Type": "application/json"
        }
    });
}