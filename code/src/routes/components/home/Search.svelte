<script lang="ts">
	import { generateAutoSuggestions } from '$lib/bible/suggestionUtils';

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

<div style="width: fit-content;">
	<input
		type="text"
		bind:value={userInput}
		onkeydown={handleKeyDown}
		oninput={async () => {
			autoSuggestions = await generateAutoSuggestions(userInput);

			if (autoSuggestions.length > 0) {
				showSuggestions = true;
			}
		}}
	/>
	{#if showSuggestions}
		<div id="suggestions-list" role="listbox">
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

<button onclick={() => fetchChapterData(userInput)}>Submit</button>

<style>
	.option {
		cursor: pointer;
	}

	.option:hover,
	.selected {
		background: #dbeafe;
	}
</style>
