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
	 * Updates the order position of this verse within its set.
	 * Sends a request to the database to persist the new order.
	 *
	 * @param {number} newOrderId - The new order position for this verse.
	 */
	updateOrder(newOrderId: number) {
		this.orderId = newOrderId;

		fetch(`api/sets/${this.verseSetId}/verses`, {
			method: "PUT",
			body: JSON.stringify({
				text: this.text,
				orderId: this.orderId,
				verseSetId: this.verseSetId,
				verseReference: this.verseReference
			})
		});
	}

	/**
	 * Adds this verse to its associated verse set.
	 * Sends a request to the database to persist the addition.
	 */
	addToSet() {
		fetch(`api/sets/${this.verseSetId}/verses`, {
			method: "POST",
			body: JSON.stringify({
				text: this.text,
				orderId: this.orderId,
				verseSetId: this.verseSetId,
				verseReference: this.verseReference
			})
		});
	}

	/**
	 * Removes this verse from its associated verse set.
	 * Sends a request to the database to persist the deletion.
	 */
	deleteFromSet() {
		fetch(`api/sets/${this.verseSetId}/verses`, {
			method: "DELETE",
			body: JSON.stringify({
				verseSetId: this.verseSetId,
				verseReference: this.verseReference
			})
		});
	}
}
