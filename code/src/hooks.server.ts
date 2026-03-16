import { saveTokens } from "$lib/utils";
import { refreshTokens } from '$lib/actions/aws';

export async function handleFetch({ event, request, fetch }) {
    // when the token expires, it will automatically be removed from the cookies
    // object because of the configuration used when it was first saved. thus, if we want
    // to check for expiration, it suffices to verify the existence of the token
    if(!event.cookies.get('accessToken')) { 
        const session = await refreshTokens(event.cookies.get('refreshToken')!);
        saveTokens({ cookieObj: event.cookies, session });
    }
    
    request = new Request(request, {
        headers: {
            ...Object.fromEntries(request.headers),
            'Authorization': event.cookies.get('idToken') ?? '',
            'Content-Type': 'application/json'
        }
    });
    
    return fetch(request);
}