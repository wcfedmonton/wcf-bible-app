<script lang="ts">
	import { onMount } from 'svelte';
	
	import Input from './Input.svelte';

	import type { OSISReference } from '$lib/shared/format';
	import { type BibleTranslation, type Verse } from '$lib/server/bible';
	import { fetchChapter, getVerseReference } from '$lib/bible/chapterServices';
	import YVTranslations from '$lib/shared/YVTranslations.json' with { type: 'json' };
	import APIBibleTranslations from '$lib/shared/APIBibleTranslations.json' with { type: 'json' };

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
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<Input 
	fetchChapterData={fetchChapterData}
/>

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