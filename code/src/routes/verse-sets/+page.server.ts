export async function load() {
	const data: string[] = [
		// server will send the verses sorted by their orderid for their initial load, client handles re-sorting on changes
		
	];

	return { data };
}
