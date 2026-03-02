import { signUp } from '$lib/actions/aws.js';

export async function POST({ url }): Promise<Response> {
    const name = url.searchParams.get("name")!;
    const email = url.searchParams.get("email")!;
    const password = url.searchParams.get("password")!;

    signUp({ name, email, password });

    return new Response(JSON.stringify({ message: "" }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
    });
}