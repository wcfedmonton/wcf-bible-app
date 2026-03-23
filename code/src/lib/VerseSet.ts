import { Verse } from './Verse';

import { getDate } from '$lib/utils';

export class VerseSet {
	id: string;
	name: string;
	lastEdited: string;

	verses: Verse[];

	constructor(id: string, name: string, lastEdited: string, verses: Verse[]) {
		this.id = id;
		this.name = name;
		this.lastEdited = lastEdited;

		this.verses = verses;
	}

	/**
	 * Upserts the set into the database.
	 *
	 * @param newName - The new name of the verse set.
	 */
	saveVerseSet(newName?: string) {
		this.name = newName ?? this.name;
		this.lastEdited = getDate();

		fetch('api/sets', {
			method: 'POST',
			body: JSON.stringify({
				item: {
					id: this.id,
					name: this.name,
					lastEdited: this.lastEdited
				},
				tableName: 'VerseSets'
			})
		});
	}

	/**
	 * Deletes this verse set.
	 * Sends a request to the database to persist the deletion.
	 */
	delete() {
		fetch(`api/sets/${this.id}`, {
			method: 'DELETE',
			body: JSON.stringify({
				item: {
					id: this.id
				},
				tableName: 'VerseSets'
			})
		});

		const verseDeleteRequests: Promise<string>[] = [];

		// simultaneously send delete requests for each verse in the set

		this.verses.forEach((verse) => {
			verseDeleteRequests.push(
				new Promise((resolve) => {
					verse.deleteFromSet();

					resolve('Verse deleted.');
				})
			);
		});

		Promise.allSettled(verseDeleteRequests);
	}
}
