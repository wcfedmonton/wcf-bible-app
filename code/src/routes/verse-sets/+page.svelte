<script lang="ts">
	import Empty from '../components/sets/Empty.svelte';
	import Populated from '../components/sets/Populated.svelte';
	import SetsSidebar from '../components/sets/Sidebar.svelte';
	import GeneralSidebar from '../components/common/Sidebar.svelte';

	import { setContext } from 'svelte';

	import { Verse } from '$lib/Verse.js';
	import { VerseSet } from '$lib/VerseSet.js';

	const { data } = $props();
	// svelte-ignore state_referenced_locally

	const sets: VerseSet[] = [];

	// initialize data classes so that user's updates can persist
	data.data.forEach((set) => {
		const versesInSet: Verse[] = [];
		set.verses.forEach((verseData) => versesInSet.push(new Verse(verseData)));

		sets.push(new VerseSet(set.id, set.name, set.lastEdited, versesInSet));
	});

	const verseSets = $state({ value: sets });
	setContext('verseSets', verseSets);

	const selectedVerseSetId = $state({
		value: verseSets.value.length > 0 ? verseSets.value[0]?.id : ''
	});
	setContext('selectedVerseSetId', selectedVerseSetId);

	const selectedVerseSet = $derived({
		value: verseSets.value.find((set) => set.id === selectedVerseSetId.value) ?? []
	});
	setContext('selectedVerseSet', selectedVerseSet);

	const searchResults = $state({ value: [] });
	setContext('searchResults', searchResults);

	const searchQuery = $state({ value: '' });
	setContext('searchQuery', searchQuery);

	const queryCopy = $state({ value: '' });
	setContext('queryCopy', queryCopy);

	const empty = $derived(verseSets.value.length === 0);

	const viewingSearchResults = $state({ value: false });
	setContext('viewingSearchResults', viewingSearchResults);
</script>

<div class="flex min-h-dvh min-w-[60rem]">
	<GeneralSidebar />
	<SetsSidebar />

	{#if empty}
		<Empty />
	{:else}
		<Populated />
	{/if}
</div>
