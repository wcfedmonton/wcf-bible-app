<script lang="ts">
	import { onMount } from 'svelte';
	import tailwindcss from '@tailwindcss/vite';

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

<div>
	<Search {fetchChapterData} />
</div>

<div class="flex justify-center">
	<Verse bind:state {fetchChapterData} />
</div>

<div class="text-center mt-(20rem)">
	<p>
		Built by 
		<a class="text-[#d3413f]" href="https://sites.google.com/view/wcfedmonton/home">
			Winners Campus Fellowship Edmonton
		</a>
	</p>
</div>
