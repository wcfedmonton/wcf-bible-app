<script lang="ts">
	import Button from '../../Button.svelte';

	import { getContext } from 'svelte';
	import { Verse } from '$lib/shared/Verse';
	import type { ContextValue } from '$lib/utils';
	import { VerseSet } from "$lib/shared/VerseSet";

	const { searchResult, index }: { searchResult: Verse; index: number } = $props();

	const verseSets = getContext<ContextValue<VerseSet[]>>('verseSets');
	const selectedVerseSetId = getContext<ContextValue<string>>('selectedVerseSetId');
	let selectedVerseSetIndex = $derived(
		verseSets.value.findIndex((set) => set.id === selectedVerseSetId.value)
	);

	const selectedVerseSet = getContext<ContextValue<VerseSet>>('selectedVerseSet');
	const searchResults = getContext<ContextValue<VerseSet[]>>('searchResults');
	const showBottomBorder = $derived(index < searchResults.value.length - 1);

	const add = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg w-[0.6rem] text-[#e0e0e0]" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
        </svg>`;
</script>

<div
	class="flex flex-between px-4 justify-center items-center w-full h-[4.7rem] {showBottomBorder
		? 'border-b border-b-border_accent'
		: ''}"
>
	<div class="w-[97%]">
		<p class="text-[0.9rem] text-[#e05250] font-medium font-serif italic">
			{searchResult.verseReference + ` (${searchResult.translation})`}
		</p>
		<p class="w-[97%] text-[.82rem] text-[#f0e6e6] font-serif">
			{searchResult.text.length > 145 ? searchResult.text.slice(0, 145).trim() + '...':searchResult.text}
		</p>
	</div>

	<div class="flex flex-row justify-end items-center h-[2.6rem]">
		<Button
			icon={add}
			prompt="Add"
			eventHandler={() => {
				// duplicates are not allowed
				if (
					!verseSets.value[selectedVerseSetIndex]?.verses.find(
						(verse) =>
							verse.text === searchResult.text && verse.translation === searchResult.translation
					)
				) {
					// reassign the context object, so it tracks the new values
					const index = verseSets.value.findIndex(set => set.id === selectedVerseSetId.value);
					verseSets.value[index] = new VerseSet(
						verseSets.value[index].id, 
						verseSets.value[index].name, 
						verseSets.value[index].lastEdited, 
						[...selectedVerseSet.value.verses, new Verse(searchResult)]
					);
					
					// this is where we'll add the verse to the set. think about integration w db
					console.log(verseSets.value[selectedVerseSetIndex])
				}
			}}
		/>
	</div>
</div>
