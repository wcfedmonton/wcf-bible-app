<script lang="ts">
	import { getContext } from 'svelte';
	import type { VerseSet, ContextValue, Verse } from '$lib/utils';
	import Buttons from './Buttons.svelte';

	let { selectedVerseSet = $bindable() }: { selectedVerseSet: VerseSet } = $props();

	const searchResults = getContext<ContextValue<Verse[]>>('searchResults');
	const viewingSearchResults = getContext<ContextValue<string>>('viewingSearchResults');

	/**
	 * Calculates the Tailwind CSS height class for a set display container
	 * based on the number of search results visible.
	 *
	 * As more search results appear, they push the container down,
	 * so the available viewport height is reduced accordingly.
	 *
	 * @param {number} searchResultsLength - The number of search results currently displayed.
	 * @returns {string} A Tailwind arbitrary height class string
	 */
	function calculateSetDisplayHeight(searchResultsLength: number) {
		if (searchResultsLength === 0) { // and extra check should be done here so there is a difference between when the user searches and there's no results and when the search results component is being displayed
			if(viewingSearchResults.value) {
				return 'h-[calc(100vh-30rem)]';
			} else {
				return 'h-[calc(100vh-13rem)]';
			}
		} else if (searchResultsLength === 1) {
			return 'h-[calc(100vh-21rem)]';
		} else if (searchResultsLength === 2) {
			return 'h-[calc(100vh-26rem)]';
		} else {
			return 'h-[calc(100vh-31rem)]';
		}
	}

	const containerHeight = $derived(calculateSetDisplayHeight(searchResults.value.length));
	const cssString = $derived(`flex flex-col items-center w-full ${containerHeight} pt-3`);
</script>

<div class="flex flex-col items-center pt-3">
	<div class="flex w-[94%]">
		<p class="text-[0.7rem] text-[#777a7d] tracking-wider">CURRENT VERSES IN SET</p>
	</div>
</div>

<div class={cssString}>
	<div class="flex-1 w-[94%] border-b-border_accent overflow-auto scrollbar-black">
		{#each selectedVerseSet.verses as verse, index (verse)}
			<div class="grid grid-cols-[auto_1fr_auto] w-full gap-x-2">
				<p class="text-light_grey row-start-1">
					{index + 1 + '.'}
				</p>
				<p class="text-[0.9rem] text-[#e05250] font-medium font-serif italic row-start-1">
					{`${verse.verseReference} (${verse.translation})`}
				</p>
				<div class="row-start-1"><Buttons bind:verses={selectedVerseSet.verses} {verse} /></div>

				<!-- empty cell for number column, verse text aligns with col 2 -->
				<span></span>
				<p class="col-start-2 col-span-2 pr-3 pb-3 mt-1 text-[.82rem] text-[#f0e6e6] font-serif">
					{verse.text}
				</p>
			</div>
			<div class="pb-3">
				<div class="border-b border-b-border_accent"></div>
				<!-- divider -->
			</div>
		{/each}
	</div>
</div>
