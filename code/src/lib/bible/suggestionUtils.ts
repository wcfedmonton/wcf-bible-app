import * as lang from 'bible-passage-reference-parser/esm/lang/en.js';
import { bcv_parser } from 'bible-passage-reference-parser/esm/bcv_parser';

import { parseQuery } from '$lib/shared/format';
import bookMap from '$lib/shared/OSIS.json';

/** Generates auto-suggestions for Bible verse references based on user input.*/
export function generateAutoSuggestions(userInput: string): string[] {
    const bcv = new bcv_parser(lang);
    const {
        passage: { books: parsed }
    } = bcv.parse(userInput);

    if(!parsed[0]) return [];

    let autoSuggestions: string[] = []; // clear the previous suggestions

    if (parsed[0]) {
        const parsedResult = parseQuery(userInput)!;
        const passageReferences: string[] = parsed[0].parsed;

        // assume every suggested book has the requested chapter/verse
        passageReferences.forEach((book) => {
            if (parsedResult && parsedResult.verseProvided) {
                autoSuggestions.push(
                    `${bookMap[book as keyof typeof bookMap]} ${parsedResult.chapter}:${parsedResult.selectedVerse}`
                );
            } else if (parsedResult && !parsedResult.verseProvided) {
                autoSuggestions.push(`${bookMap[book as keyof typeof bookMap]} ${parsedResult.chapter}`);
            }
        });

        autoSuggestions = autoSuggestions
            .filter((suggestion) => parseQuery(suggestion) !== null) // verify that the suggestions are valid
            .sort();
    }

    return autoSuggestions;
}