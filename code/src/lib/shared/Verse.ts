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

    updateOrder(newOrderId: number) {
        this.orderId = newOrderId;

        console.log(`new orderId: ${this.orderId}`)
        console.log(`sending verse order update request for verse (${this.verseSetId}, ${this.verseReference})`)
    }

    addToSet() {
        console.log("sending verse addition request for set", this.verseSetId);
    }

    deleteFromSet() {
        console.log("sending verse delete request for set", this.verseSetId);
    }
}