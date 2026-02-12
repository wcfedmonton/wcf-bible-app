<script lang="ts">
	import { onMount } from 'svelte';
	import * as lang from 'bible-passage-reference-parser/esm/lang/en.js';
	import { bcv_parser } from 'bible-passage-reference-parser/esm/bcv_parser';

	import bookMap from '$lib/shared/OSIS.json';
	import { parseQuery, type OSISReference } from '$lib/shared/format';
	import { type BibleTranslation, type Verse } from '$lib/server/bible';
	import YVTranslations from '$lib/shared/YVTranslations.json' with { type: 'json' };
	import APIBibleTranslations from '$lib/shared/APIBibleTranslations.json' with { type: 'json' };

	let userInput = '';
	let verseLimit = 1;
	let verseReference = '';
	let osis: OSISReference;
	let verseData: Verse[] = [];
	let selectedVerseIndex: number;
	let selectedTranslation: BibleTranslation = 'NIV';
	const translations = [
		...new Set([...Object.keys(YVTranslations), ...Object.keys(APIBibleTranslations)])
	].sort();

	/**
	 * Fetches and initializes chapter verse data for a parsed Bible reference and selected translation.
	 *
	 * @param input - A Bible reference string (e.g., "gen 1 1") to be parsed into book and chapter information.
	 * @param translation - The selected Bible translation identifier used to fetch the corresponding chapter data.
	 */
	async function getChapter(input: string, translation: BibleTranslation) {
		const testOsis = parseQuery(input)!;

		if (!testOsis) return;

		osis = testOsis; // we only assign the result of the parsing if it's a valid query

		const params = new URLSearchParams({
			query: `${osis.book}.${osis.chapter}`, // normalize the query to increase cache hits
			translation
		});

		const res = await fetch(`api/verses?${params.toString()}`);
		const resolved = await res.json();

		// verse length must be verified since some translations do not have certain verses
		verseData = resolved.verses.length === 0 ? verseData : resolved.verses;
		verseLimit = resolved.verses.length === 0 ? verseLimit : resolved.numVerses;
		selectedVerseIndex =
			resolved.verses.length === 0
				? selectedVerseIndex
				: verseData.findIndex((verse) => `${verse.id}` === `${osis.selectedVerse}`);

		verseReference = resolved.verses.length === 0 ? verseReference : getVerseReference();
	}

	onMount(() => getChapter('John 1:1', selectedTranslation)); // this will be the default verse

	/** Resolves and returns a valid selected verse reference.*/
	function getVerseReference(): string {
		const verseNumber = verseData[selectedVerseIndex]?.id ?? verseData[0]?.id;

		return `${bookMap[osis.book]} ${osis.chapter}:${verseNumber}`;
	}

	let highlightedIndex = -1;
	let showSuggestions = false;
	let autoSuggestions: string[] = [];

	/** Generates auto-suggestions for Bible verse references based on user input.*/
	function generateAutoSuggestions() {
		const bcv = new bcv_parser(lang);
		const {
			passage: { books: parsed }
		} = bcv.parse(userInput);
		autoSuggestions = []; // clear the previous suggestions

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

			highlightedIndex = -1;
			showSuggestions = true;
			autoSuggestions = autoSuggestions
				.filter((suggestion) => parseQuery(suggestion) !== null) // verify that the suggestions are valid
				.sort();
		}
	}

	/**
	 * Handles selection of an auto-suggestion.
	 *
	 * @param {string} suggestion - The selected suggestion value.
	 */
	function selectSuggestion(suggestion: string) {
		autoSuggestions = []; // clear the suggestions
		highlightedIndex = -1;
		showSuggestions = false;

		getChapter(suggestion, selectedTranslation);
	}

	/**
	 * Handles keyboard navigation for the auto-suggestion dropdown.
	 *
	 * @param {KeyboardEvent} event - The keyboard event triggered on key press.
	 */
	function handleKeyDown(event: KeyboardEvent) {
		if (!showSuggestions) return;

		if (event.key === 'ArrowDown') {
			event.preventDefault();

			highlightedIndex = (highlightedIndex + 1) % autoSuggestions.length;
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();

			highlightedIndex = Math.abs((highlightedIndex - 1) % autoSuggestions.length);
		} else if (event.key === 'Enter') {
			event.preventDefault();

			selectSuggestion(autoSuggestions[highlightedIndex]);
		}
	}
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<!-- NOTE: THESE ARE TEST COMPONENTS AND CAN BE MODIFIED TO REPRESENT THE REAL COMPONENTS -->
<div
	style="width: fit-content;"
	role="combobox"
	on:keydown={handleKeyDown}
	tabindex="0"
	aria-controls="suggestions-list"
	aria-expanded={showSuggestions}
>
	<input
		type="text"
		bind:value={userInput}
		on:input={generateAutoSuggestions}
		on:keydown={(event: KeyboardEvent) => {
			if (event.key === 'Enter') {
				getChapter(userInput, selectedTranslation);
			}
		}}
	/>
	{#if showSuggestions}
		<div id="suggestions-list">
			{#each autoSuggestions as suggestion, index (suggestion)}
				<option
					class="option"
					on:click={() => selectSuggestion(suggestion)}
					class:selected={index === highlightedIndex}
				>
					{suggestion}
				</option>
			{/each}
		</div>
	{/if}
</div>

<button on:click={() => getChapter(userInput, selectedTranslation)}>Submit</button>

<div>
	<p>{verseReference}</p>
	<p>{verseData[selectedVerseIndex]?.text}</p>
</div>

<button
	id="button"
	on:click={() => {
		selectedVerseIndex -= 1;
		verseReference = getVerseReference();
	}}
	disabled={selectedVerseIndex == 0}>Previous</button
>
<button
	on:click={() => {
		selectedVerseIndex += 1;
		verseReference = getVerseReference();
	}}
	disabled={selectedVerseIndex == verseLimit - 1}>Next</button
>

<select
	bind:value={selectedTranslation}
	on:change={() => {
		getChapter(verseReference, selectedTranslation);

		// verse reference is updated again to handle the case where the user changes to a translation that
		// doesn't have the selected verse
		verseReference = getVerseReference();
	}}
>
	{#each translations as translation (translation)}
		<option value={translation}>{translation}</option>
	{/each}
</select>

<style>
	.option {
		cursor: pointer;
	}

	.option:hover,
	.selected {
		background: #dbeafe;
	}
</style>
