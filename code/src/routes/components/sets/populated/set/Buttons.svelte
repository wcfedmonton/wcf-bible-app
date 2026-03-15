<script lang="ts">
	import { getContext } from 'svelte';
	import { Verse } from '$lib/Verse';
	import type { ContextValue } from '$lib/utils';
	import { VerseSet } from '$lib/VerseSet';

	let { verses = $bindable(), verse }: { verses: Verse[]; verse: Verse } = $props();

	const verseSets = getContext<ContextValue<VerseSet[]>>('verseSets');
	const selectedVerseSetId = getContext<ContextValue<string>>('selectedVerseSetId');

	const disabledCss = `group-hover:text-accent_btn`;

	// we'd like the action icons for the arrows to appear disabled when the action doesn't make sense
	// (i.e. the action would move the verse 'out of bounds'). so we define their svg elements as functions
	// that accept the disabled state of the action and style them accordingly

	const upArrow = (disabled: boolean) => {
		return `
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-arrow-up text-light_grey ${disabled ? '' : disabledCss}" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5"/>
            </svg>
        `;
	};

	const downArrow = (disabled: boolean) => {
		return `
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="12" fill="currentColor" class="bi bi-arrow-down text-light_grey ${disabled ? '' : disabledCss}" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1"/>
            </svg>
        `;
	};

	// the button that deletes a verse doesn't require any disabled state to correctly render, but we still define it
	// as a function so that it matches with the method signature that the '#each' statement (defined below) expects
	const trashCan = () => {
		return `
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-trash3 text-light_grey ${disabledCss}" viewBox="0 0 16 16">
                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
            </svg>
        `;
	};

	let index = $derived(verses.indexOf(verse));

	/** Reassigns the 'verseSets' context variable to trigger a re-render. */
	function updateUIVerseOrder() {
		const i = verseSets.value.findIndex((set) => set.id === selectedVerseSetId.value);
		const current = verseSets.value[i];
		verseSets.value[i] = new VerseSet(
			current.id,
			current.name,
			current.lastEdited,
			[...current.verses].sort((a, b) => (a.orderId < b.orderId ? -1 : 1))
		);
	}

	/**
	 * Moves the current verse one position up in the list.
	 *
	 * If the verse is not already at the top, this function swaps
	 * its `orderId` with the verse above it and then re-sorts the `verses`
	 * array so the display order matches the updated order IDs.
	 *
	 * @function moveVerseUp
	 * @returns {void}
	 */
	function moveVerseUp() {
		if (index > 0) {
			const currentVerse = verses[index];
			const nextVerse = verses[index - 1];

			currentVerse.updateOrder(nextVerse.orderId);
			nextVerse.updateOrder(currentVerse.orderId + 1);

			verses.sort((a, b) => (a.orderId < b.orderId ? -1 : 1));

			updateUIVerseOrder();
		}
	}

	/**
	 * Moves the current verse one position down in the list.
	 *
	 * If the verse is not already at the bottom, this function
	 * swaps its `orderId` with the verse below it and re-sorts
	 * the `verses` array to reflect the new ordering.
	 *
	 * @function moveVerseDown
	 * @returns {void}
	 */
	function moveVerseDown() {
		if (index < verses.length - 1) {
			const currentVerse = verses[index];
			const nextVerse = verses[index + 1];

			currentVerse.updateOrder(nextVerse.orderId);
			nextVerse.updateOrder(currentVerse.orderId - 1);

			updateUIVerseOrder();
		}
	}

	/**
	 * Removes the current verse from the verses list.
	 *
	 * @function deleteVerse
	 * @returns {void}
	 */
	function deleteVerse() {
		verse.deleteFromSet();

		const i = verseSets.value.findIndex((set) => set.id === selectedVerseSetId.value);
		const current = verseSets.value[i];
		verseSets.value[i] = new VerseSet(
			current.id,
			current.name,
			current.lastEdited,
			current.verses.filter((v) => v.text !== verse.text || v.translation !== verse.translation)
		);
	}

	const eventHandlers = $derived([
		{ action: moveVerseUp, disabledCondition: index === 0 },
		{ action: moveVerseDown, disabledCondition: index === verses.length - 1 },
		{ action: deleteVerse, disabledCondition: false }
	]);
</script>

<div class="flex flex-row gap-1 pb-2 ml-5">
	{#each [upArrow, downArrow, trashCan] as icon, index (index)}
		<button
			aria-label="verse set action"
			onclick={eventHandlers[index].action}
			class="group cursor-pointer flex flex-row justify-center items-center w-7 h-5 border rounded-sm border-border_accent {eventHandlers[
				index
			].disabledCondition
				? ''
				: 'hover:border-accent_btn'}"
		>
			{@html icon(eventHandlers[index].disabledCondition)}
		</button>
	{/each}
</div>
