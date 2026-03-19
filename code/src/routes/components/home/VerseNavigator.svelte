<script lang="ts">
	import tailwindcss from '@tailwindcss/vite';
	import { getVerseReference } from '$lib/bible/chapterServices';
	import YVTranslations from '$lib/shared/YVTranslations.json' with { type: 'json' };
	import APIBibleTranslations from '$lib/shared/APIBibleTranslations.json' with { type: 'json' };
	import previous_icon from '$lib/assets/Arrow-Left-1--Streamline-Ultimate-converted-from-png.svg';
	import next_icon from '$lib/assets/Arrow-Right-1--Streamline-Ultimate-converted-from-png.svg';
	let { state = $bindable(), fetchChapterData } = $props();

	const translations = [
		...new Set([...Object.keys(YVTranslations), ...Object.keys(APIBibleTranslations)])
	].sort();
</script>



<div style="display: flex; flex-direction: row;">
	<div class="w-(15%) flex justify-start mr-(15rem) mt-(15%)">
		<button
			class="text-center bg-transparent outline-none border-none disabled:opacity-(0.5) cursor-not-allowed"
			onclick={() => {
			state.selectedVerseIndex -= 1;
			state.verseReference = getVerseReference(state.verseData, state.osis, state.selectedVerseIndex);
			}}
			disabled={state.selectedVerseIndex == 0}><img class="text-center bg-transparent outline-none border-none disabled:opacity-(0.5) cursor-not-allowed" src={previous_icon} alt="Previous" /></button
		>
	</div>




	<div class="flex justify-center items-left flex-col gap-(1rem) w-(100%) mt-(5%) h-(100%)">
		<div class="position-left w-(100%)">
			<h1 class="text-2xl font-bold">{state.verseReference}</h1>
		</div>

		<div class="color-red-400">
			<select class="color-red-200 italic text-sm"
				bind:value={state.translation}
				onchange={() => {
					fetchChapterData(state.verseReference, state.selectedTranslation);

					// verse reference is updated again to handle the case where the user changes to a translation that
					// doesn't have the selected verse
					state.verseReference = getVerseReference(
						state.verseData,
						state.osis,
						state.selectedVerseIndex
					);
				}}
			>
				{#each translations as translation (translation)}
					<option value={translation}>{translation}</option>
				{/each}
			</select>
		</div>

		<div class="w-(100%) overflow-y-auto">
			<h3 class="text-base">{state.verseData[state.selectedVerseIndex]?.text}</h3>
		</div>

	</div>




	<div class="w-(15%) flex justify-end mr-(15rem) mt-(15%)">
		<button
			class="text-center bg-transparent outline-none border-none disabled:opacity-(0.5) cursor-not-allowed"
			onclick={() => {
				state.selectedVerseIndex += 1;
				state.verseReference = getVerseReference(state.verseData, state.osis, state.selectedVerseIndex);
			}}
			disabled={state.selectedVerseIndex == state.verseLimit - 1}><img class="text-center bg-transparent outline-none border-none disabled:opacity-(0.5) cursor-not-allowed" src={next_icon} alt="Next" /></button
		>
	</div>
</div>
