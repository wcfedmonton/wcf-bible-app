export async function POST({ request }) {
    console.log(await request.json())

    return new Response(JSON.stringify({ message: "Set sucessfuly created." }), {
        status: 201,
        headers: {
            "Content-Type": "application/json"
        }
    });
}