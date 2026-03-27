type VerseData = {
	text: string;
	orderId: number;
	verseSetId: string;
	translation: string;
	verseReference: string;
};

export class Verse {
	text: string;
	orderId: number;
	verseSetId: string;
	translation: string;
	verseReference: string;

	constructor(data: VerseData) {
		this.text = data.text;
		this.orderId = data.orderId;
		this.verseSetId = data.verseSetId;
		this.translation = data.translation;
		this.verseReference = data.verseReference;
	}

	/**
	 * Upserts the verse into the database.
	 *
	 * @param {number} newOrderId - The new order position for this verse.
	 */
	async saveVerse(newOrderId?: number) {
		this.orderId = newOrderId ?? this.orderId;

		await fetch(`api/sets/${this.verseSetId}/verses`, {
			method: 'POST',
			body: JSON.stringify({
				item: {
					text: this.text,
					orderId: this.orderId,
					verseSetId: this.verseSetId,
					translation: this.translation,
					verseReference: this.verseReference
				},
				tableName: 'Verses'
			})
		});
	}

	/**
	 * Removes this verse from its associated verse set.
	 * Sends a request to the database to persist the deletion.
	 */
	async deleteFromSet() {
		await fetch(`api/sets/${this.verseSetId}/verses`, {
			method: 'DELETE',
			body: JSON.stringify({
				item: {
					verseSetId: this.verseSetId,
					verseReference: this.verseReference
				},
				tableName: 'Verses'
			})
		});
	}
}
