<script lang="ts">
	import SearchResult from './SearchResult.svelte';

	import { getContext } from 'svelte';
	import type { ContextValue, Verse } from '$lib/utils';

	const { searchQuery }: { searchQuery: string } = $props();

	const searchResults = getContext<ContextValue<Verse[]>>('searchResults');
</script>

<div class="flex flex-row justify-center items-start">
	<div class="relative w-[94%] h-fi mt-[1rem] rounded-sm border border-border_accent">
		<div
			class="flex flex-col justify-center w-full h-8 border border-solid border-transparent rounded-tl rounded-tr bg-form_input"
		>
			<p class="pl-2 text-[0.65rem] text-light_grey tracking-light">
				RESULTS FOR "{searchQuery.toUpperCase()}"
			</p>
		</div>

		{#each searchResults.value as result, index (index)}
			<SearchResult searchResult={result} {index} />
		{/each}
	</div>
</div>
