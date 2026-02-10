<script lang="ts">
	import { onMount } from 'svelte';
	import bookMap from '../lib/shared/books.json';
	import { parseQuery, type OSISReference } from '$lib/shared/format';
	import { type BibleTranslation, type Verse } from '$lib/server/bible';

	let userInput = '';
	let verseLimit = 1;
	let selectedVerse = 1;
	let verseReference = '';
	let osis: OSISReference;
	let verseData: Verse[] = [];
	let translation: BibleTranslation = 'NIV';

	async function getChapter(input: string, translation: BibleTranslation) {
		//normalize the input (so it has the form [book][chapter]) to increase cache hits
		const querySplit = input.split(/[ :,–]/).filter(Boolean);
		const modifiedQuery = querySplit.slice(0, 2).join('');
		const params = new URLSearchParams({
			query: modifiedQuery,
			translation
		});

		const res = await fetch(`api/verses?${params.toString()}`);

		if (res.status === 400) return;

		const resolved = await res.json();

		// before saving the response, verify that something was returned
		osis = parseQuery(input)!;
		verseData = resolved.verses.length === 0 ? verseData : resolved.verses;
		verseLimit = resolved.verses.length === 0 ? verseLimit : resolved.numVerses;
		selectedVerse = resolved.verses.length === 0 ? selectedVerse : resolved.selectedVerse;
		verseReference =
			resolved.verses.length === 0
				? verseReference
				: `${bookMap[osis.book]} ${osis.chapter}:${selectedVerse + 1}`;
	}

	onMount(async () => await getChapter('John 1:1', translation)); // this will be the default verse

	async function handleSubmit() {
		await getChapter(userInput, translation);
	}
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<!-- NOTE: THESE ARE TEST COMPONENTS AND CAN BE DELETED -->
<input type="text" bind:value={userInput} />
<button on:click={handleSubmit}>Submit</button>

<div>
	<p>{verseReference}</p>
	<p>{verseData[selectedVerse]?.text}</p>
</div>

<button
	on:click={() => {
		selectedVerse -= 1;
		verseReference = `${bookMap[osis.book]} ${osis.chapter}:${selectedVerse + 1}`;
	}}
	disabled={selectedVerse == 0}>Previous</button
>
<button
	on:click={() => {
		selectedVerse += 1;
		verseReference = `${bookMap[osis.book]} ${osis.chapter}:${selectedVerse + 1}`;
	}}
	disabled={selectedVerse == verseLimit - 1}>Next</button
>
