<script lang="ts">
	import { getTranslations } from '$lib/utils';
	import { getVerseReference } from '$lib/bible/chapterServices';

	const translations = getTranslations();
	let { state = $bindable(), fetchChapterData } = $props();
</script>

<div>
	<p>{state.verseReference}</p>
	<p>{state.verseData[state.selectedVerseIndex]?.text}</p>
</div>

<button
	id="button"
	onclick={() => {
		state.selectedVerseIndex -= 1;
		state.verseReference = getVerseReference(state.verseData, state.osis, state.selectedVerseIndex);
	}}
	disabled={state.selectedVerseIndex == 0}>Previous</button
>
<button
	onclick={() => {
		state.selectedVerseIndex += 1;
		state.verseReference = getVerseReference(state.verseData, state.osis, state.selectedVerseIndex);
	}}
	disabled={state.selectedVerseIndex == state.verseLimit - 1}>Next</button
>

<select
	bind:value={state.translation}
	onchange={() => {
		fetchChapterData(state.verseReference);

		// verse reference is updated again to handle the case where the user changes to a translation that
		// doesn't have the selected verse
		state.verseReference = getVerseReference(state.verseData, state.osis, state.selectedVerseIndex);
	}}
>
	{#each translations as translation (translation)}
		<option value={translation}>{translation}</option>
	{/each}
</select>
