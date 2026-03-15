export async function PUT({ request }) {
    console.log(await request.json())

    return new Response(JSON.stringify({ message: "Set updated sucessfully" }), {
        status: 200,
        headers: {
            "Content-Type": "application/json"
        }
    });
}

export async function DELETE({ request }) {
    console.log(await request.json())

    return new Response(JSON.stringify({ message: "Set deleted sucessfully." }), {
        status: 200,
        headers: {
            "Content-Type": "application/json"
        }
    });
}