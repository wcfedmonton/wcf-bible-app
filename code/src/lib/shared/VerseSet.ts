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

    rename(newName: string) {
        console.log(`sending request to change name for verse set ${this.id} to ${newName}`)
    }

    delete() {
        console.log(`sending request to delete verse ${this.id}`)
    }
}