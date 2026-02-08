import { bcv_parser } from 'bible-passage-reference-parser/esm/bcv_parser.js';
import * as lang from 'bible-passage-reference-parser/esm/lang/en.js';
import bookMap from './books.json' with { type: 'json' };
import USFM from './USFM.json' with { type: 'json' };

/**
 * Represents a biblical reference in OSIS (Open Scripture Information Standard) format.
 *
 * @property {keyof typeof bookMap} book - The book identifier as defined in books.json (e.g., "GEN" for Genesis)
 * @property {number} chapter - The chapter number (1-based indexing)
 * @property {number} verses - The verse number or the last verse number in a range (1-based indexing)
 */
type OSISReference = {
	book: keyof typeof bookMap;
	chapter: number;
	numVerses: number;
	selectedVerse: number;
};

/**
 * Parses a user-provided biblical reference query into a standardized OSIS format.
 *
 * Supports various input formats such as:
 * - "Gen 1:1"
 * - "John 3:16"
 * - "Psalm 119"
 * - "1 Cor 13"
 *
 * @param {string} query - A biblical reference string in natural language format
 * @returns {OSISReference} An object containing the parsed book, chapter, and verse number(s)
 *
 * @example
 * const ref = parseQuery("Genesis 1:1");
 * // Returns: { book: "GEN", chapter: 1, numVerses: 31, selectedVerse: 1 }
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function parseQuery(query: string): OSISReference | null {
	const bcv = new bcv_parser(lang);
	const generalResult = bcv.parse(query).entities[0].passages[0];

	// change compaction strategy otherwise only the first verse is returned in the 'start' and 'end' objects of the response
	bcv.set_options({ osis_compaction_strategy: 'bcv' });

	// handle the case where the chapter hasn't been specified yet or the input is invalid (e.g. out of bounds for chapter)
	if (generalResult.start.c === undefined || generalResult.valid.valid === false) {
		return null;
	}

	// modify the user input so that we can use bcv.parse to get the verse range for the chapter in the OSIS output
	const modifiedQuery = `${generalResult.start.b}.${generalResult.start.c}`;

	const fullRange = bcv.parse(modifiedQuery).osis(); // output has form: Gen.1.1-Gen.1.31
	const upperBound = fullRange.split('-')[1];
	const lastVerseInChapter = parseInt(upperBound.split('.')[2]);

	return {
		book: generalResult.start.b as keyof typeof bookMap,
		chapter: generalResult.start.c,
		numVerses: lastVerseInChapter,
		selectedVerse: generalResult.start.v ? generalResult.start.v : 1 // start at the first verse if no verse was specified by the user
	};
}

/**
 * Converts an OSIS biblical reference into an array of USFM (Unified Standard Format Marker) references.
 *
 * Maps the OSIS book identifier to its USFM equivalent and generates a full reference string
 * for each verse in the specified range.
 *
 * @param {OSISReference} OSIS - An OSIS-formatted biblical reference object
 * @returns {string[]} An array of USFM reference strings, one for each verse in the range
 *
 * @example
 * const osis = { book: "GEN", chapter: 1, numVerses: 31, selectedVerse: 1 };
 * const usfm = getUSFMReferences(osis);
 * // Returns: ["GEN.1.1", "GEN.1.2", ... , "GEN.1.31"]
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getUSFMReferences(OSIS: OSISReference): string[] {
	const bookName = bookMap[OSIS.book] as keyof typeof USFM;

	const USFMReferences = Array.from({ length: OSIS.numVerses }, (_, i): string => {
		return `${USFM[bookName]}.${OSIS.chapter}.${i + 1}`;
	});

	return USFMReferences;
}
