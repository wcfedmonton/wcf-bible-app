<script lang="ts">
	import Set from './populated/set/Set.svelte';
	import Empty from './populated/Empty.svelte';
	import Header from './populated/Header.svelte';
	import Search from './populated/search/Search.svelte';
	import SearchResults from './populated/search/SearchResults.svelte';

	import { getContext } from 'svelte';
	import { VerseSet } from '$lib/shared/VerseSet';
	import type { ContextValue, Verse } from '$lib/utils';

	const verseSets = getContext<ContextValue<VerseSet[]>>('verseSets');
	const selectedVerseSetId = getContext<ContextValue<string>>('selectedVerseSetId');
	let selectedVerseSet = $derived(
		verseSets.value.find((set) => set.id === selectedVerseSetId.value)
	);

	const searchResults = $derived(getContext<ContextValue<Verse[]>>('searchResults'));
	//  svelte/state_referenced_locally

	let selectedTranslation = $state('NIV'); // will be set to user's default translation
	const translationCopy = $derived(selectedTranslation);

	const viewingSearchResults = $derived(getContext<ContextValue<boolean>>('viewingSearchResults'));
</script>

<div class="w-full h-screen">
	<Header bind:selectedVerseSet />
	<Search verseSet={selectedVerseSet} bind:selectedTranslation />

	{#if selectedVerseSet?.verses.length === 0 && searchResults.value.length === 0 && !viewingSearchResults.value}
		<!-- the second check is to ensure the two screens don't show at the same time -->
		<Empty />
	{:else if searchResults.value.length > 0 || viewingSearchResults.value}
		<!-- the second condition allows the display of a message in the panel even when there's no results -->
		<SearchResults selectedTranslation={translationCopy} />
	{/if}

	{#if selectedVerseSet?.verses.length && selectedVerseSet?.verses.length > 0}
		<Set bind:selectedVerseSet />
	{/if}
</div>
