<script lang="ts">
	import Search from './components/home/Search.svelte';
	import Verse from './components/home/VerseNavigator.svelte';

	import type { OSISReference } from '$lib/shared/format';
	import { fetchChapter } from '$lib/bible/chapterServices';
	import { type BibleTranslation, type Verse as VerseType } from '$lib/server/bible';

	const { data: initialData } = $props(); // initial data is loaded on the server
	
	let state: {
		verseLimit: number;
		osis?: OSISReference;
		verseReference: string;
		verseData: VerseType[];
		selectedVerseIndex: number;
		translation: BibleTranslation;
	// svelte-ignore state_referenced_locally
		} = $state(initialData);

	async function fetchChapterData(query: string) {
		const updatedData = await fetchChapter({
			input: query,
			...state
		})!;

		if (updatedData) {
			state.osis = updatedData.osis;
			state.verseData = updatedData.verseData;
			state.verseLimit = updatedData.verseLimit;
			state.verseReference = updatedData.verseReference;
			state.selectedVerseIndex = updatedData.selectedVerseIndex;
		}
	}
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<Search {fetchChapterData} />

<Verse bind:state {fetchChapterData} />
