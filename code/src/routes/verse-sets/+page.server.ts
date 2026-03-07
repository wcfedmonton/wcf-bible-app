export async function load() {
	const data = [
		{
			id: 'abc', // a reference to the database id
			verses: [],
			lastEdited: 'Mar 7, 2026',
			name: 'Sunday Service: Comfort & Hope'

			// update()  will send a request after an update (adding/removing a verse from the set). it will accept
			// the id of the verse to delete, and then the action that should be done (add or remove)
			// delete() will send a request to delete the verse set
		}
	];

	return { data };
}
