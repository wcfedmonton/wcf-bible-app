<script lang="ts">
	import { getContext } from 'svelte';
	import type { ContextValue } from '$lib/utils';
	import { getVerseReference } from '$lib/bible/chapterServices';
	import YVTranslations from '$lib/shared/YVTranslations.json' with { type: 'json' };
	import APIBibleTranslations from '$lib/shared/APIBibleTranslations.json' with { type: 'json' };

	let { dataState = $bindable(), fetchChapterData } = $props();
	
	const translations = [
		...new Set([...Object.keys(YVTranslations), ...Object.keys(APIBibleTranslations)])
	].sort();

	let open = $state(false);
	
	const navigatingSet = $derived(getContext<ContextValue<boolean>>('navigatingSet'));
</script>

<svelte:window
	onclick={(event) => {
		if (!(event.target instanceof HTMLButtonElement)) {
			open = false;
		}
	}}
/>

<div class="flex flex-row justify-center items-center w-[100%]"> 
	<div class="flex flex-row justify-between w-full">
		<div class="flex flex-col justify-center items-center h-[25rem]">
			<button
				aria-label="previous"
				class="cursor-pointer w-[2.5rem] ml-2 text-center bg-transparent outline-none border-none disabled:opacity-30 disabled:cursor-not-allowed"
				onclick={() => {
					dataState.selectedVerseIndex -= 1;
					dataState.verseReference = navigatingSet.value ? 
						dataState.verseData[dataState.selectedVerseIndex].verseReference : getVerseReference(dataState.verseData, dataState.osis, dataState.selectedVerseIndex) ;
				}}
				disabled={dataState.selectedVerseIndex == 0}
			>
				<svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
					<path d="M 30 8 L 14 24 L 30 40" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</button>
		</div>

		<div class="flex flex-col justify-center items-center w-full">
			<div class="w-[85%]">
				<div class="w-(100%) pb-4">
					<h1 class="text-5xl font-serif font-md">{dataState.verseReference}</h1>
				</div>

				<div class=" inline-block">
					<button
						type="button"
						class="relative flex flex-row items-center w-[4.25rem] h-9 pl-2 pr-5 py-1 bg-[#d3413f2e]/50 40 text-[#d3413f] text-sm  rounded cursor-pointer border-none outline-none"
						onclick={() => open = !open}
					>
						{navigatingSet.value ?
							dataState.verseData[dataState.selectedVerseIndex].translation : 
							dataState.translation
						}
						<span class="absolute ml-2 right-1 top-1/2 -translate-y-1/2 pointer-events-none text-[#d3413f]">
							<svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
								<path d="M2 4 L6 8 L10 4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
							</svg>
						</span>
					</button>

					{#if open}
						<ul class="absolute w-[4.25rem] bg-[#1a1a1a] border border-red-900/30 rounded max-h-40 overflow-auto scrollbar-black">
							{#each translations as translation (translation)}
								<li>
									<button
										type="button"
										class="w-full text-left px-2 py-1 text-sm text-[#d3413f] hover:bg-[#d3413f2e]/50 cursor-pointer"
										onclick={() => {
											open = false;
											dataState.translation = translation;
											fetchChapterData(dataState.verseReference, dataState.selectedTranslation);
											dataState.verseReference = getVerseReference(dataState.verseData, dataState.osis, dataState.selectedVerseIndex);
										}}
									>
										{translation}
									</button>
								</li>
							{/each}
						</ul>
					{/if}
				</div>

				<div class="w-(100%) pt-4">
					<h3 class="font-serif text-2xl">{dataState.verseData[dataState.selectedVerseIndex]?.text}</h3>
				</div>
			</div>
		</div>

		<div class="flex flex-col justify-center items-center h-[25rem]">
			<button
				aria-label="next"
				class="cursor-pointer mr-2 text-center bg-transparent outline-none border-none disabled:opacity-50 disabled:cursor-not-allowed"
				onclick={() => {
					dataState.selectedVerseIndex += 1;
					dataState.verseReference = navigatingSet.value ? 
						dataState.verseData[dataState.selectedVerseIndex].verseReference : getVerseReference(dataState.verseData, dataState.osis, dataState.selectedVerseIndex) ;
				}}
				disabled={dataState.selectedVerseIndex == dataState.verseLimit - 1}
			>	
				<svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" class="pointer-events-none">
					<path d="M 18 8 L 34 24 L 18 40" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" class="disabled:opacity-30"/>
				</svg>
			</button>
		</div>
	</div>
</div>
