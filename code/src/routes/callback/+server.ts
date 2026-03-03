import { PUBLIC_DOMAIN } from '$env/static/public';

export function GET({ url }) {
	const code = url.searchParams.get('code');

	const html = `
        <script>
            if (window.opener) {
                window.opener.postMessage(
                    { type: "GOOGLE_AUTH_SUCCESS", code: "${code}" },
                    "${PUBLIC_DOMAIN}"
                );
            }
            window.close();
        <\/script>
    `;

	return new Response(html, {
		headers: { 'Content-Type': 'text/html' }
	});
};
