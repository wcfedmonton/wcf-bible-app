<script lang="ts">
	import { generateAutoSuggestions } from '$lib/bible/suggestionUtils';
	import search_icon from '$lib/assets/OOjs_UI_icon_keyboard.svg';

	let userInput = $state('');
	let highlightedIndex = $state(-1);
	let { fetchChapterData } = $props();
	let showSuggestions = $state(false);
	let autoSuggestions: string[] = $state([]);

	/**
	 * Handles selection of an auto-suggestion.
	 *
	 * @param {string} suggestion - The selected suggestion value.
	 */
	function selectSuggestion(suggestion: string) {
		autoSuggestions = []; // clear the suggestions
		highlightedIndex = -1;
		showSuggestions = false;

		fetchChapterData(suggestion);
	}

	/**
	 * Handles keyboard navigation for the auto-suggestion dropdown.
	 *
	 * @param {KeyboardEvent} event - The keyboard event triggered on key press.
	 */
	function handleKeyDown(event: KeyboardEvent) {
		if (!showSuggestions || autoSuggestions.length === 0) return;

		if (event.key === 'ArrowDown') {
			event.preventDefault();

			highlightedIndex = (highlightedIndex + 1) % autoSuggestions.length;
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();

			highlightedIndex = (highlightedIndex - 1 + autoSuggestions.length) % autoSuggestions.length;
		} else if (event.key === 'Enter') {
			event.preventDefault();

			if (highlightedIndex >= 0) {
				selectSuggestion(autoSuggestions[highlightedIndex]);
			} else {
				fetchChapterData(userInput);
			}
		}
	}
</script>

<div class="topnav">
	<div class="search-bar-container">
		<div class="search-input-container">
			<input
				type="text"
				class="search-bar"
				bind:value={userInput}
				onkeydown={handleKeyDown}
				placeholder="start typing to find verse"
				oninput={async () => {
					autoSuggestions = await generateAutoSuggestions(userInput);
					if(autoSuggestions.length > 0) {
						showSuggestions = true;
					}
				}}
			>
			<img class="search-icon" src={search_icon} alt="search icon"/> 
			{#if showSuggestions}
			<div class="suggestions-list" role="listbox">
				{#each autoSuggestions as suggestion, index (suggestion)}
					<div
						role="option"
						class="option"
						class:selected={index === highlightedIndex}
						tabindex="-1"
						aria-selected={index === highlightedIndex}
						onkeydown={handleKeyDown}
						onclick={() => selectSuggestion(suggestion)}
					>
						{suggestion}
					</div>
				{/each}
			</div>
		{/if}
	</div>
		</div>
		
</div>

<style>
	.option {
		cursor: pointer;
	}
	.suggestions-list {
		position: fixed;
		margin-top: 2.2rem;
		background: grey;
		width: 14.75%;
	}
	.option:hover,
	.selected {
		background: #dbeafe;
	}
	.search-bar-container {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		width: fit-content;
		margin-left: 83%;
	}
	.search-bar {
		z-index: 0;
		font-size: auto;
		position: fixed;
		padding-top: 0.4rem; 
		padding-bottom: 0.4rem;
		padding-left: 1.9rem;
		padding-right: 0.3rem;
		width: 13%;
		border-radius: 1rem;
	}
	.search-icon {
		z-index: 1;
		position: fixed;
		padding: 0.4rem 0.5rem;
		transform: scale(75%);
	}

	.search-input-container {
		position: relative;
	}
</style>
