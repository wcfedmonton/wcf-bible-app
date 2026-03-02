export const GET = ({ url }) => {
	const code = url.searchParams.get('code');

	const html = `
        <script>
            if (window.opener) {
                window.opener.postMessage(
                    { type: "GOOGLE_AUTH_SUCCESS", code: "${code}" },
                    "http://localhost:5173"
                );
            }
            window.close();
        <\/script>
    `;

	return new Response(html, {
		headers: { 'Content-Type': 'text/html' }
	});
};
