<script lang="ts">
	import Search from '../components/home/Search.svelte';
	import Verse from '../components/home/VerseNavigator.svelte';
	import SidebarButton from '../components/home/SidebarButton.svelte';
	import GeneralSidebar from '../components/home/sidebar/general/GeneralSidebar.svelte';
	import AuthenticatedSidebar from '../components/home/sidebar/authenticated/AuthenticatedSidebar.svelte';

	import { setContext } from 'svelte';
	import type { OSISReference } from '$lib/shared/format';
	import { fetchChapter } from '$lib/bible/chapterServices';
	import { type BibleTranslation, type Verse as VerseType } from '$lib/server/bible';

	const { data: initialData } = $props();

	let dataState: {
		verseLimit: number;
		osis?: OSISReference;
		verseReference: string;
		verseData: VerseType[];
		authenticated: boolean;
		selectedVerseIndex: number;
		translation: BibleTranslation;
		// svelte-ignore state_referenced_locally
	} = $state({ ...initialData.initialVerse, authenticated: initialData.authenticated });

	let showSidebar = $state(false);

	const selectedSetIndex = $state({ value: -1 });
	setContext('selectedSetIndex', selectedSetIndex);

	if(dataState.authenticated) {
		const name: string = $derived(initialData.name);
		setContext('name', { get value() { return name } });

		const verseSets = $derived(initialData.sets);
		setContext('verseSets', { get value() { return verseSets } });
	}

	async function fetchChapterData(query: string) {
		selectedSetIndex.value = -1; // make no set appear selected since the user will no longer be navigating through a set

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
</script>

<div class="relative w-full h-dvh flex flex-row">
    {#if showSidebar}
        <div class="absolute top-0 left-0 h-full z-50">
            {#if dataState.authenticated}
                <AuthenticatedSidebar bind:showSidebar/>
            {:else}
                <GeneralSidebar bind:showSidebar />
            {/if}
        </div>
    {/if}

    <div class="relative flex-1 h-dvh flex flex-col justify-center items-center">
        <div class="absolute top-0 left-0 flex flex-row justify-between w-full">
            <SidebarButton bind:showSidebar />
			<Search fetchChapterData={fetchChapterData} />
        </div>

        <div class="w-full">
            <Verse bind:dataState {fetchChapterData} />
        </div>

        <p class="absolute bottom-0 pb-3">
            Built by 
            <a class="text-[#d3413f]" href="https://sites.google.com/view/wcfedmonton/home">
                Winners Campus Fellowship Edmonton
            </a>
        </p>
    </div>
</div>