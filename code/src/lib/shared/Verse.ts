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
		console.log(`changing order id of verse ${this.verseReference} to ${newOrderId}`);
	}

	/**
	 * Adds this verse to its associated verse set.
	 * Sends a request to the database to persist the addition.
	 */
	addToSet() {
		console.log(`adding verse ${this.verseReference} to set ${this.verseSetId}`);
	}

	/**
	 * Removes this verse from its associated verse set.
	 * Sends a request to the database to persist the deletion.
	 */
	deleteFromSet() {
		console.log(`deleting verse ${this.verseReference} from set ${this.verseSetId}`);
	}
}
