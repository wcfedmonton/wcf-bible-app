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

<div class="flex flex-col justify-center items-center h-[4.2rem]">
    <div class="relative w-[95%]">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[#606060]">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M7 16h10"/>
            </svg>
        </span>

        <input
            type="text"
            bind:value={userInput}
            onkeydown={handleKeyDown}
            placeholder="Search by verse or phrase..."
            class="w-[95%] pl-10 pr-4 py-2 bg-[#1a1a1a] text-[#cccccc] placeholder-[#606060] placeholder:text-[0.79rem] text-sm rounded-full border border-border_accent outline-none focus:ring-0 focus:border-gray-700"
            oninput={async () => {
                autoSuggestions = await generateAutoSuggestions(userInput);
                if (autoSuggestions.length > 0) {
                    showSuggestions = true;
                }
            }}
        />
    </div>
</div>