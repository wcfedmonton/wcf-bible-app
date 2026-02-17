<script lang="ts">
	import { onMount } from 'svelte';

	import Search from './components/home/Search.svelte';
	import Verse from './components/home/VerseNavigator.svelte';

	import type { OSISReference } from '$lib/shared/format';
	import { fetchChapter } from '$lib/bible/chapterServices';
	import { type BibleTranslation, type Verse as VerseType } from '$lib/server/bible';

	let state: {
		verseLimit: number;
		verseReference: string;
		osis?: OSISReference;
		verseData: VerseType[];
		selectedVerseIndex: number;
		translation: BibleTranslation;
	} = $state({
		verseLimit: 1,
		verseReference: '',
		osis: undefined,
		verseData: [],
		selectedVerseIndex: 0,
		translation: 'NIV'
	});


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

	onMount(async () => fetchChapterData('John 1:1')); // this will be the default verse
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<Search {fetchChapterData} />

<Verse
	bind:state
	{fetchChapterData}
/>
