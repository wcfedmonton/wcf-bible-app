import { Verse } from "./Verse";

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
     * Renames this verse set.
     * Sends a request to the database to persist the new name.
     *
     * @param {string} newName - The new name for this verse set.
     */
    rename(newName: string) {
        console.log(`sending request to change name for verse set ${this.id} to ${newName}`)
    }

    /**
     * Deletes this verse set.
     * Sends a request to the database to persist the deletion.
     */
    delete() {
        console.log(`sending request to delete verse set ${this.id}`)
    }
}