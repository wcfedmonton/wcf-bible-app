export async function load() {
	const data = [
		{
			id: 'abc', // a reference to the database id
			verses: [{
				verseSetId: "abc",
				translation: "NIV", // translation is kept seperate from reference for integration with the home page
				verseReference: "John 14:27",
				text: "Peace I leave with you; my peace I give you."
			}],
			lastEdited: 'Mar 7, 2026',
			name: 'New Verse Set'

			// update()  will send a request after an update (adding/removing a verse from the set). it will accept
			// the id of the verse to delete, and then the action that should be done (add or remove)
			// delete() will send a request to delete the verse set
		}
	];

	return { data };
}
