import { getUserEmail } from '$lib/actions/google.js';

export async function POST({ url }): Promise<Response> {
    const code = url.searchParams.get("code")!;
    console.log(await getUserEmail(code));

    return new Response(JSON.stringify({ message: "" }));
}