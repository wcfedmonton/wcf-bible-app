<script lang="ts">
	import { getTranslations } from '$lib/utils';
	import { getVerseReference } from '$lib/bible/chapterServices';
	import YVTranslations from '$lib/shared/YVTranslations.json' with { type: 'json' };
	import APIBibleTranslations from '$lib/shared/APIBibleTranslations.json' with { type: 'json' };
	import previous_icon from '$lib/assets/Arrow-Left-1--Streamline-Ultimate-converted-from-png.svg';
	import next_icon from '$lib/assets/Arrow-Right-1--Streamline-Ultimate-converted-from-png.svg';
	let { state = $bindable(), fetchChapterData } = $props();
</script>



<div style="display: flex; flex-direction: row;">
	<div class="nav-button-container">
		<button
			class="nav_button"
			onclick={() => {
			state.selectedVerseIndex -= 1;
			state.verseReference = getVerseReference(state.verseData, state.osis, state.selectedVerseIndex);
			}}
			disabled={state.selectedVerseIndex == 0}><img class="nav_button" src={previous_icon} alt="Previous" /></button
		>
	</div>




	<div class=verse-navigator-container>
		<div class="verse-header-container">
			<h1 class="verse-header">{state.verseReference}</h1>
		</div>

		<div class="version-dropdown-container">
			<select class="version-dropdown"
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

		<div class="verse-content-container">
			<h3 class="verse-content">{state.verseData[state.selectedVerseIndex]?.text}</h3>
		</div>

	</div>




	<div class="nav-button-container-next">
		<button
			class="nav_button"
			onclick={() => {
				state.selectedVerseIndex += 1;
				state.verseReference = getVerseReference(state.verseData, state.osis, state.selectedVerseIndex);
			}}
			disabled={state.selectedVerseIndex == state.verseLimit - 1}><img class="nav_button" src={next_icon} alt="Next" /></button
		>
	</div>
</div>

<style>
	.nav_button {
		text-align: center;
		background: transparent;
		outline: none !important;
		border: none;
		opacity: 2.0;
	}
	.nav_button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	.verse-navigator-container {
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: left;
		gap: 1rem;
		width: 100%;
		margin-top: 5%;
		height: 100%;
	}
	.verse-header-container {
		position: left;
		width: 100%;
	}
	.nav-button-container {
		width: 15%; 
		display: flex;
		justify-content: flex-start;
		margin-right: 15rem;
		margin-top: 15%;
	}
	.nav-button-container-next {
		width: 15%; 
		display: flex;
		justify-content: flex-end;
		margin-left: 15rem;
		margin-top: 15%;
	}
</style>
