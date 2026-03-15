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
	 * Updates the verse set with this id to have the new name it was initialized with.
	 * 
	 * @param {string} newName - The new name for this verse set.
	 */
	async rename(newName: string) {
		this.name = newName;
		this.lastEdited = getDate();
		console.log(`sending request to change name for verse set ${this.id} to ${this.name}`);

		await fetch(`api/sets/${this.id}`, {
			method: "PUT",
			body: JSON.stringify({
				id: this.id,
				name: this.name,
				lastEdited: this.lastEdited
			})
		});
	}

	/**
	 * Deletes this verse set.
	 * Sends a request to the database to persist the deletion.
	 */
	async delete() {
		console.log(`sending request to delete verse set ${this.id}`);

		await fetch(`api/sets/${this.id}`, {
			method: "DELETE",
			body: JSON.stringify({
				id: this.id
			})
		});
	}
}
