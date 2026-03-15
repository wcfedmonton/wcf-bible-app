import { putItem, deleteItem } from "$lib/actions/dynamo.js";

export async function POST({ request }) {
    putItem("Verses", await request.json());

    return new Response(JSON.stringify({ message: "Verse added to set successfully." }), {
        status: 200,
        headers: {
            "Content-Type": "application/json"
        }
    });
}

export async function PUT({ request }) {
    putItem("Verses", await request.json());

    return new Response(JSON.stringify({ message: "Verse updated successfully." }), {
        status: 200,
        headers: {
            "Content-Type": "application/json"
        }
    });
}

export async function DELETE({ request }) {
    deleteItem("Verses", await request.json());

    return new Response(JSON.stringify({ message: "Verse deleted successfully." }), {
        status: 200,
        headers: {
            "Content-Type": "application/json"
        }
    });
}