<script lang="ts">
	import { onMount } from 'svelte';
	
	import { fetchChapter, getVerseReference } from '$lib/bible/chapterServices';
	import { generateAutoSuggestions } from '$lib/bible/suggestionUtils';
	
	import { type BibleTranslation, type Verse } from '$lib/server/bible';
	import YVTranslations from '$lib/shared/YVTranslations.json' with { type: 'json' };
	import APIBibleTranslations from '$lib/shared/APIBibleTranslations.json' with { type: 'json' };
	import type { OSISReference } from '$lib/shared/format';

	let userInput = '';
	let verseLimit = 1;
	let verseReference = '';
	let osis: OSISReference;
	let verseData: Verse[] = [];
	let selectedVerseIndex: number = 0;
	let selectedTranslation: BibleTranslation = 'NIV';
	const translations = [
		...new Set([...Object.keys(YVTranslations), ...Object.keys(APIBibleTranslations)])
	].sort();

	async function fetchChapterData(query: string) {
		const updatedData = await fetchChapter({
			input: query,
			verseData,
			verseLimit,
			verseReference,
			selectedVerseIndex,
			selectedTranslation
		})!;

		if(updatedData) {
			osis = updatedData.osis;
			verseData = updatedData.verseData;
			verseLimit = updatedData.verseLimit;
			verseReference = updatedData.verseReference;
			selectedVerseIndex = updatedData.selectedVerseIndex; 
		}	
	}
	
	onMount(async () => fetchChapterData('John 1:1')); // this will be the default verse

	let highlightedIndex = -1;
	let showSuggestions = false;
	let autoSuggestions: string[] = [];

	/**
	 * Handles selection of an auto-suggestion.
	 *
	 * @param {string} suggestion - The selected suggestion value.
	 */
	function selectSuggestion(suggestion: string) {
		autoSuggestions = []; // clear the suggestions
		highlightedIndex = -1;
		showSuggestions = false;

		fetchChapterData(suggestion);
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
		on:input={() => {
			autoSuggestions = generateAutoSuggestions(userInput);
			
			if(autoSuggestions.length > 0) {
				showSuggestions = true
			}
		}}
		on:keydown={(event: KeyboardEvent) => {
			if (event.key === 'Enter') {
				fetchChapterData(userInput);
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

<button on:click={() => fetchChapterData(userInput)}>Submit</button>

<div>
	<p>{verseReference}</p>
	<p>{verseData[selectedVerseIndex]?.text}</p>
</div>

<button
	id="button"
	on:click={() => {
		selectedVerseIndex -= 1;
		verseReference = getVerseReference(verseData, osis, selectedVerseIndex);
	}}
	disabled={selectedVerseIndex == 0}>Previous</button
>
<button
	on:click={() => {
		selectedVerseIndex += 1;
		verseReference = getVerseReference(verseData, osis, selectedVerseIndex);
	}}
	disabled={selectedVerseIndex == verseLimit - 1}>Next</button
>

<select
	bind:value={selectedTranslation}
	on:change={() => {
		fetchChapterData(verseReference);

		// verse reference is updated again to handle the case where the user changes to a translation that
		// doesn't have the selected verse
		verseReference = getVerseReference(verseData, osis, selectedVerseIndex);
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
