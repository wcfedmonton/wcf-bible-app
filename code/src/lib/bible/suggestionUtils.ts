import * as lang from 'bible-passage-reference-parser/esm/lang/en.js';
import { bcv_parser } from 'bible-passage-reference-parser/esm/bcv_parser';

import bookMap from '$lib/shared/OSIS.json';
import { parseQuery } from '$lib/shared/format';

/** Generates auto-suggestions for Bible verse references based on user input.*/
export async function generateAutoSuggestions(userInput: string): Promise<string[]> {
	const bcv = new bcv_parser(lang);
	const {
		passage: { books: parsed }
	} = bcv.parse(userInput);

	if (!parsed[0]) {
		// if there is no bible chapter/verse reference in the user input, we perform a phrase search instead
		const params = new URLSearchParams({ query: userInput });
		const res = await fetch(`api/references?${params.toString()}`);
		const { suggestions } = await res.json();

		// results must be filtered since sometimes the Bible SDK returns invalid references
		return suggestions?.filter((suggestion: string) => parseQuery(suggestion) !== null);
	}

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
