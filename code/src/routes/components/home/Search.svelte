<script lang="ts">
	import tailwindcss from '@tailwindcss/vite';
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

<div class="flex">
	<div class="flex-col gap-(0.5rem) w-fit ml-(83%)">
		<div class="relative">
			<input
				type="text"
				class="z-0 text-auto fixed pt-(0.4rem) pb-(0.4rem) pl-(1.9rem) pr-(0.3rem) w-(13%) rounded-(1rem)"
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
			<img class="fixed z-1 py-(0.4rem) px-(0.5rem) scale-75" src={search_icon} alt="search icon"/> 
			{#if showSuggestions}
			<div class="fixed mt-(2.2rem) bg-gray w-(14.75%)" role="listbox">
				{#each autoSuggestions as suggestion, index (suggestion)}
					<div
						role="option"
						class="cursor-pointer hover:selected bg-gray-200"
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
