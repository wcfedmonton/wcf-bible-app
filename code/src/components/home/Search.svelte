<script lang="ts">
	import { getContext } from 'svelte';
	import type { ContextValue } from '$lib/utils';
	import { generateAutoSuggestions } from '$lib/bible/suggestionUtils';

	let userInput = $state('');
	let selectedIndex = $state(-1);
	let { fetchChapterData } = $props();
	let showSuggestions = $state(false);
	let autoSuggestions: string[] = $state([]);

	let loading = $state(false);
	const navigatingSet = getContext<ContextValue<boolean>>('navigatingSet');

	/**
	 * Handles selection of an auto-suggestion.
	 *
	 * @param {string} suggestion - The selected suggestion value.
	 */
	async function selectSuggestion(suggestion: string) {
		navigatingSet.value = false;

		autoSuggestions = []; // clear the suggestions
		selectedIndex = -1;
		showSuggestions = false;

		loading = true;

		await fetchChapterData(suggestion);

		userInput = '';
		loading = false;
	}

	/**
	 * Handles keyboard navigation for the auto-suggestion dropdown.
	 *
	 * @param {KeyboardEvent} event - The keyboard event triggered on key press.
	 */
	async function handleKeyDown(event: KeyboardEvent) {
		if (!showSuggestions || autoSuggestions.length === 0) return;

		if (event.key === 'ArrowDown') {
			event.preventDefault();

			selectedIndex = (selectedIndex + 1) % autoSuggestions.length;
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();

			selectedIndex = (selectedIndex - 1 + autoSuggestions.length) % autoSuggestions.length;
		} else if (event.key === 'Enter') {
			event.preventDefault();

			showSuggestions = false;
			navigatingSet.value = false;

			if (selectedIndex >= 0) {
				selectSuggestion(autoSuggestions[selectedIndex]);
			} else {
				loading = true;

				await fetchChapterData(userInput);

				userInput = '';
				loading = false;
			}
		}
	}
</script>

<svelte:window
	onclick={(event) => {
		if (!(event.target instanceof HTMLInputElement)) {
			showSuggestions = false;
		}
	}}
/>

<div class="flex flex-col justify-center items-center h-[4.2rem]">
	<div class="relative w-[95%]">
		<span class="absolute left-3 top-1/2 -translate-y-1/2 text-[#606060]">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			>
				<rect x="2" y="4" width="20" height="16" rx="2" />
				<path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M7 16h10" />
			</svg>
		</span>

		<div class="flex flex-row">
			<input
				type="text"
				bind:value={userInput}
				onkeydown={handleKeyDown}
				placeholder="Search by verse or phrase..."
				class="w-[96%] pl-8 pr-6 py-2 bg-[#1a1a1a] text-[#cccccc] placeholder-[#606060] placeholder:text-[0.79rem] text-sm border border-border_accent outline-none focus:ring-0 focus:border-gray-700
				{showSuggestions && autoSuggestions.length > 0
					? 'rounded-tl-sm rounded-tr-sm rounded-b-none border-b-[#1a1a1a]'
					: 'rounded-sm'}"
				oninput={async () => {
					autoSuggestions = await generateAutoSuggestions(userInput);
					if (autoSuggestions.length > 0) {
						showSuggestions = true;
					}
				}}
			/>

			{#if loading}
				<!-- display spinner -->
				<div
					class="absolute top-1/2 -translate-y-1/2 right-[6%] flex items-center animate-spin text-light_grey"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path stroke="none" d="M0 0h24v24H0z" fill="none" />
						<path d="M12 6l0 -3" /><path d="M16.25 7.75l2.15 -2.15" /><path d="M18 12l3 0" /><path
							d="M16.25 16.25l2.15 2.15"
						/>
						<path d="M12 18l0 3" /><path d="M7.75 16.25l-2.15 2.15" /><path d="M6 12l-3 0" />
						<path d="M7.75 7.75l-2.15 -2.15" />
					</svg>
				</div>
			{/if}
		</div>

		<!-- dropdown -->
		{#if showSuggestions && autoSuggestions.length > 0}
			<ul
				class="absolute top-full left-0 w-[96%] bg-[#1a1a1a] border border-border_accent border-t-0 rounded-b-sm overflow-hidden z-50 shadow-lg shadow-black/40"
			>
				{#each autoSuggestions as suggestion, i (suggestion)}
					<li>
						<button
							type="button"
							class="cursor-pointer w-full text-left px-3 py-2 text-sm flex items-center gap-2 bg-[#1a1a1a]
                                   {i === selectedIndex
								? 'bg-[#2a2a2a] text-[#e0e0e0]'
								: 'text-[#aaaaaa] hover:bg-[#222222] hover:text-[#cccccc]'}
                                   {i === autoSuggestions.length - 1
								? ''
								: 'border-b border-[#2a2a2a]'}"
							onmouseenter={() => (selectedIndex = i)}
							onmouseleave={() => (selectedIndex = -1)}
							onclick={() => selectSuggestion(suggestion)}
						>
							<span>{suggestion}</span>
						</button>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>
