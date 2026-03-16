import { saveTokens } from "$lib/utils";
import { refreshTokens } from '$lib/actions/aws';
import type { Cookies } from "@sveltejs/kit";

export async function handle({ event, resolve }) {
    const refreshToken = event.cookies.get('refreshToken');
    const privateRoutes = ['/verse-sets']; // can be expanded later to include other routes

    // navigation to the private routes is prohibited if the user is not authenticated
    if (!refreshToken && privateRoutes.includes(event.url.pathname)) {
        return new Response(null, {
            status: 302,
            headers: { location: '/login' }
        });
    }
    
    return resolve(event);
}

export async function handleFetch({ event, request, fetch }) {
    // when the token expires, it will automatically be removed from the cookies
    // object because of the configuration used when it was first saved. thus, if we want
    // to check for expiration, it suffices to verify the existence of the token
    if(!event.cookies.get('accessToken') || !event.cookies.get('idToken')) { 
        const session = await refreshTokens(event.cookies.get('refreshToken')!);
        saveTokens({ cookieObj: event.cookies, session });
    }

    const defaultHeaders = {
        ...Object.fromEntries(request.headers),
        'Authorization': event.cookies.get('idToken')!,
        'Content-Type': 'application/json'
    }

    // the user id is attached to the request for set updates/creation
    // because we need to track who owns a set.
    // NOTE: this condition could be extended to include other routes
    if(request.method === "POST" && request.url.endsWith("/sets")) {
        request = await addUserIdToRequest(event.cookies, request, defaultHeaders);
    } else {
        request = new Request(request, {
            headers: { ...defaultHeaders }
        });
    }
    
    return fetch(request);
}

/**
 * Injects the authenticated user's ID into the request body before it is sent.
 *
 * Extracts the user's `sub` claim from the Cognito ID token stored in cookies,
 * and assigns it to `payload.item.userId`. This ensures the user ID is derived
 * from a verified server-side token rather than being supplied by the client,
 * preventing users from spoofing another user's identity.
 *
 * @param cookies - The SvelteKit cookies object.
 * @param request - The outgoing request whose JSON body will be augmented.
 * @param defaultHeaders - Headers to apply to the reconstructed request.
 * @returns A new {@link Request} with the same URL and method as the original,
 * but with `payload.item.userId` set to the authenticated user's ID.
 */
async function addUserIdToRequest(cookies: Cookies, request: Request, defaultHeaders: object) {
    const payload = await request.json();
        
    const claims = JSON.parse(atob(cookies.get('idToken')!.split('.')[1]));
    payload.item.userId = claims.sub;
    
    request = new Request(request, {
        headers: { ...defaultHeaders },
        body: JSON.stringify(payload)
    });

    return request;
}