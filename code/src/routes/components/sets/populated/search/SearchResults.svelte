<script lang="ts">
	import SearchResult from './SearchResult.svelte';

	import { getContext } from 'svelte';
	import type { ContextValue, Verse } from '$lib/utils';

	const { searchQuery, selectedTranslation }: { searchQuery: string, selectedTranslation: string } = $props();

	const searchResults = getContext<ContextValue<Verse[]>>('searchResults');
	const viewingSearchResults = $derived(getContext<ContextValue<Verse[]>>('viewingSearchResults'));

	const header = `
		<div
			class="flex flex-col justify-center w-full h-8 border border-solid border-transparent rounded-tl rounded-tr bg-form_input"
		>
			<p class="pl-2 text-[0.65rem] text-light_grey tracking-light">
				RESULTS FOR "${searchQuery.toUpperCase()}"
			</p>
		</div>
	`;
</script>

<div class="flex flex-row justify-center items-start">
	<div class={`relative w-[94%] h-fi ${(searchResults.value.length > 0 || !viewingSearchResults.value) ? "rounded-sm border border-border_accent" : ""}`}>
		{#if searchResults.value.length > 0}
			{@html header}

			{#each searchResults.value as result, index (index)}
				<SearchResult searchResult={result} {index} />
			{/each}
		{:else if !viewingSearchResults.value}
			{@html header}

			<div class="flex flex-col justify-center items-center w-full h-50">
				<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-search text-border_accent" viewBox="0 0 16 16">
					<path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
				</svg>

				<div class="flex flex-col justify-center items-center">
					<p class="pt-4 font-serif text-[0.9rem] text-[#b0b5b1] font-normal">No verses found</p>
					<p class="w-100 pt-2 text-center text-light_grey text-[0.77rem]">
						No search results for <span class="text-[#b0b5b1]">"{searchQuery}"</span> in {selectedTranslation}
					</p>
					<p class="w-100 pt-[0.1rem] text-center text-light_grey text-[0.77rem]">
						Try a different phrase, reference, or translation.
					</p>
				</div>
			</div>
		{/if}
	</div>
</div>
