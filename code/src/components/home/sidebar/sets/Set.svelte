<script lang="ts">
	import { getContext } from 'svelte';
	import type { ContextValue, VerseSet } from '$lib/utils';
	import type { FetchChapterResult } from '$lib/bible/chapterServices';

	let { index, selectedIndex = $bindable(), set } = $props();

	let selected = $derived(selectedIndex.value === index);

	const verseSets = getContext<ContextValue<VerseSet[]>>('verseSets');
	const navigatingSet = getContext<ContextValue<boolean>>('navigatingSet');
	const dataState = getContext<ContextValue<FetchChapterResult>>('dataState');

	const hasVerses = $derived(verseSets.value[index].verses.length > 0);
</script>

<button
	onclick={() => {
		// set a flag to indicate that we're navigating through a set since the behaviour for
		// the verse navigator must be modified to handle verse sets
		navigatingSet.value = true;

		selectedIndex.value = index;
		const selectedSet = verseSets.value[selectedIndex.value];

		const versesInSet = selectedSet.verses.map((verse) => ({
			text: verse.text,
			translation: verse.translation,
			verseReference: verse.verseReference
		}));

		dataState.value.selectedVerseIndex = 0;
		dataState.value.verseData = versesInSet;
		dataState.value.verseLimit = selectedSet.verses.length;
		dataState.value.verseReference = selectedSet.verses[0].verseReference;
	}}
	disabled={!hasVerses}
	class="cursor-pointer w-full h-11 px-5 flex justify-center items-center hover:bg-light_grey/30 disabled:opacity-30 disabled:cursor-not-allowed"
>
	<div class="w-[95%] h-full flex flex-row justify-start items-center">
		{#if selected}
			<div class="rounded-full w-[0.35rem] h-[0.35rem] mr-3 bg-red-400"></div>
		{/if}

		<p
			class="font-sans text-form_title text-[0.85rem] {selected
				? 'text-red-400'
				: 'text-form_title'}"
		>
			{set.name}
		</p>
	</div>
</button>
