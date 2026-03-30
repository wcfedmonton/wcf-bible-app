<script lang="ts">
	import Button from '../Button.svelte';

	import { Verse } from '$lib/Verse';
	import { getContext } from 'svelte';
	import { VerseSet } from '$lib/VerseSet';
	import type { ContextValue, Verse as VerseObject, VerseSet as VerseSetObject } from '$lib/utils';

	let {
		importedSet = $bindable(),
		selectedFile = $bindable(),
		showImportModal = $bindable()
	} = $props();

	const verseSets = getContext<ContextValue<VerseSetObject[]>>('verseSets');
	const selectedVerseSetId = getContext<ContextValue<string>>('selectedVerseSetId');
</script>

<div
	class="flex flex-col justify-center item-center w-full h-13 border border-border_accent rounded bg-zinc-800"
>
	<div class="flex flex-row justify-between px-3">
		<div class="flex flex-row items-center gap-2">
			<svg
				width="15"
				height="15"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.8"
				class="text-accent_btn"
			>
				<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
				<polyline points="14 2 14 8 20 8"></polyline>
			</svg>

			<p>{selectedFile.name}</p>
		</div>

		<button
			aria-label="Deselect file"
			onclick={() => {
				importedSet = null;
				selectedFile = null;
			}}
			class="cursor-pointer flex flex-row justify-center items-center rounded hover:text-accent_btn"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				fill="currentColor"
				class="bi bi-x"
				viewBox="0 0 16 16"
			>
				<path
					d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"
				/>
			</svg>
		</button>
	</div>
</div>

<div class="flex justify-center items-center w-full border border-border_accent rounded">
	<div class="flex flex-col w-[91%] h-[80%] py-4">
		<p class="pb-2 font-serif text-[0.98rem]">{importedSet?.name}</p>

		{#each importedSet?.verses.slice(0, 5) as verse, index (verse.verseReference)}
			<p class="text-[0.8rem] text-[#777a7d]">
				{`${index + 1}. ${verse.verseReference} (${verse.translation})`}
			</p>
		{/each}

		{#if importedSet?.verses.length > 5}
			<p class="pl-3 pt-1 text-[0.8rem] text-[#777a7d]">
				{`(${importedSet?.verses.length - 5} more...)`}
			</p>
		{/if}
	</div>
</div>

<Button
	action="Import"
	disabledCondition={false}
	eventHandler={async () => {
		const newVerseSet = new VerseSet(
			importedSet.id,
			importedSet.name,
			importedSet.lastEdited,
			importedSet.verses.map((verse: VerseObject) => new Verse(verse))
		);

		await newVerseSet.saveVerseSet();
		await Promise.all(newVerseSet.verses.map((verse) => verse.saveVerse()));

		verseSets.value = [...verseSets.value, newVerseSet];
		selectedVerseSetId.value = newVerseSet.id;

		showImportModal = false; // ✅ close only after everything is saved
	}}
/>
