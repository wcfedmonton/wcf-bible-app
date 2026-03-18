<script lang="ts">
	import Search from '../components/home/Search.svelte';
	import Sidebar from '../components/common/Sidebar.svelte';
	import Verse from '../components/home/VerseNavigator.svelte';
	import SidebarButton from '../components/home/SidebarButton.svelte';
	import AuthenticatedSidebar from '../components/home/sidebar/AuthenticatedSidebar.svelte';

	import type { OSISReference } from '$lib/shared/format';
	import { fetchChapter } from '$lib/bible/chapterServices';
	import { type BibleTranslation, type Verse as VerseType } from '$lib/server/bible';

	const { data: initialData } = $props(); // initial data is loaded on the server

	let dataState: {
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
			...dataState
		})!;

		if (updatedData) {
			dataState.osis = updatedData.osis;
			dataState.verseData = updatedData.verseData;
			dataState.verseLimit = updatedData.verseLimit;
			dataState.verseReference = updatedData.verseReference;
			dataState.selectedVerseIndex = updatedData.selectedVerseIndex;
		}
	}

	let showSidebar: boolean = $state(false);
</script>

<!-- <Search {fetchChapterData} /> -->

<!-- <Verse bind:state {fetchChapterData} /> -->

<div class="absolute">
	<div class="absolute top-0 left-0">
		<SidebarButton bind:showSidebar />
	</div>

	{#if showSidebar}
		<div class="absolute top-0 left-0">
			<AuthenticatedSidebar bind:showSidebar/>
		</div>
	{/if}
</div>