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
	async saveVerseSet(newName?: string) {
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
	async delete() {
		fetch(`api/sets/${this.id}`, {
			method: 'DELETE',
			body: JSON.stringify({
				item: {
					id: this.id
				},
				tableName: 'VerseSets'
			})
		});

		// simultaneously send delete requests for each verse in the set

		Promise.allSettled(this.verses.map(verse => verse.deleteFromSet()));
	}
}
