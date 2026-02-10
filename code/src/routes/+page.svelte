<script lang="ts">
	import { onMount } from 'svelte';
	import bookMap from '$lib/shared/books.json';
	import { parseQuery, type OSISReference } from '$lib/shared/format';
	import { type BibleTranslation, type Verse } from '$lib/server/bible';

	let userInput = '';
	let verseLimit = 1;
	let verseReference = '';
	let osis: OSISReference;
	let verseData: Verse[] = [];
	let selectedVerseIndex: number;
	let translation: BibleTranslation = 'NKJV';

	async function getChapter(input: string, translation: BibleTranslation) {
		osis = parseQuery(input)!;

		if (!osis) return; // 'no results found' message can be shown on dropdown

		const params = new URLSearchParams({
			query: `${osis.book}.${osis.chapter}`, // normalize the query to increase cache hits
			translation
		});

		const res = await fetch(`api/verses?${params.toString()}`);

		if (res.status === 400) return; // 'no results found' message can be shown on dropdown

		const resolved = await res.json();

		// before saving the response, verify that something was returned
		verseData = resolved.verses.length === 0 ? verseData : resolved.verses;
		verseLimit = resolved.verses.length === 0 ? verseLimit : resolved.numVerses;
		selectedVerseIndex = resolved.verses.length === 0 ? selectedVerseIndex : osis.selectedVerse;
		verseReference =
			resolved.verses.length === 0
				? verseReference
				: `${bookMap[osis.book]} ${osis.chapter}:${resolveSelectedVerseId()}`;
	}

	onMount(async () => await getChapter('John 1:1', translation)); // this will be the default verse

	// Resolves and returns a valid selected verse ID, defaulting to the first available verse when the requested verse is missing

	function resolveSelectedVerseId() { 
		if (!selectedVerseIndex) selectedVerseIndex = 0;

		// selectedVerseIndex must be updated since it is used to check bounds
		const index = verseData.findIndex((value) => value?.id === selectedVerseIndex);
		selectedVerseIndex = index > 0 ? index : 0; // if match not found, default to the first entry

		return verseData[index]?.id ? verseData[index]?.id : verseData[0]?.id;
	}
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<!-- NOTE: THESE ARE TEST COMPONENTS AND CAN BE DELETED -->
<input type="text" bind:value={userInput} />
<button on:click={async () => await getChapter(userInput, translation)}>Submit</button>

<div>
	<p>{verseReference}</p>
	<p>{verseData[selectedVerseIndex]?.text}</p>
</div>

<button
	on:click={() => {
		selectedVerseIndex -= 1;
		verseReference = `${bookMap[osis.book]} ${osis.chapter}:${verseData[selectedVerseIndex].id}`;
	}}
	disabled={selectedVerseIndex == 0}>Previous</button
>
<button
	on:click={() => {
		selectedVerseIndex += 1;
		verseReference = `${bookMap[osis.book]} ${osis.chapter}:${verseData[selectedVerseIndex].id}`;
	}}
	disabled={selectedVerseIndex == verseLimit - 1}>Next</button
>
