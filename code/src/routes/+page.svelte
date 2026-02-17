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
<div class="Search_Bar"> <!--Write dropdown menu functionality-->
	<input type ="text" placeholder="start typing to find verse" bind:value={state.verseReference} oninput={() => fetchChapterData(state.verseReference)} />
</div>

<div class="Verse_Header">
	<h1>{state.verseReference}</h1> 
</div>

<div class="Version_Select">
	<select bind:value={state.translation} onchange={() => fetchChapterData(state.verseReference)}>
		<option value="KJV">KJV</option>
		<option value="ESV">ESV</option>
	</select>
</div>

<div class="Verse_Display">
	<h3>{state.verseData.map(v => v.text).join(' ')}</h3>
</div>

<div class="Credits">
	<p>	
		Built by <a href="https://sites.google.com/view/wcfedmonton/home"> Winners Campus Fellowship Edmonton</a>
	</p>
</div>

<style>
	.Search_Bar {
		margin: 20px;
		text-align: right;
		font-size: small;
	}

	.Verse_Header {
		text-align: center;
	}

	.Version_Select {
		margin: 20px;
	}

	.Verse_Display {
		margin: 20px;
		font-size: 1.5em;
	}

	.Credits {
		text-align: center;
		margin-top: 40px;
		font-size: 0.9em;
		color: #555;
	}
</style>

<Search {fetchChapterData} />

<Verse bind:state {fetchChapterData} />
