export async function handleFetch({ event, request, fetch }) {
    request = new Request(request, {
        headers: {
            ...Object.fromEntries(request.headers),
            'Authorization': event.cookies.get('idToken') ?? '',
            'Content-Type': 'application/json'
        }
    });
    // don't forget to add the user id here
    return fetch(request);
}