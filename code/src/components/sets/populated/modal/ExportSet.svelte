<script lang="ts">
	import Modal from './Modal.svelte';
	import FooterButton from './Button.svelte';
	import Button from './export/Button.svelte';

	import { getContext } from 'svelte';
	import type { ContextValue, VerseSet } from '$lib/utils';

	let { showExportModal = $bindable() } = $props();

	const verseSets = getContext<ContextValue<VerseSet[]>>('verseSets');
	const selectedVerseSetId = getContext<ContextValue<string>>('selectedVerseSetId');

	const selectedSet = $derived(verseSets.value.find((set) => set.id === selectedVerseSetId.value))!;

	let email = $state('');
	let selectedIndex = $state(0);
	const validEmail = $derived(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));

	function toFileName(title: string) {
		return (
			title
				.toLowerCase()
				.replace(/&/g, 'and')
				.replace(/[^a-z0-9\s-]/g, '')
				.trim()
				.replace(/\s+/g, '-') + '.json'
		);
	}

	const setCopy = $derived({
		// create a modified copy for security
		name: selectedSet.name,
		verses: selectedSet.verses.map((verse) => ({
			orderId: verse.orderId,
			translation: verse.translation,
			verseReference: verse.verseReference
		}))
	});
	const blob = $derived(new Blob([JSON.stringify(setCopy)], { type: 'application/json' }));
	const kilobytes = $derived(((blob.size / 1024) * 100).toPrecision(2)); // returns the set size in kilobytes

	function exportSet() {
		const url = URL.createObjectURL(blob);

		const a = document.createElement('a');
		a.download = toFileName(setCopy.name);
		a.href = url;
		a.click();

		showExportModal = false;
		URL.revokeObjectURL(url); // clean up memory
	}
</script>

<Modal modalTitle="Export Verse Set" bind:showModal={showExportModal}>
	<div class="w-full">
		<p class="font-serif text-[0.8rem] text-light_grey">Exporting</p>
		<p class="font-serif font-semibold italic text-[1rem]">{selectedSet.name}</p>
	</div>

	<div class="flex flex-row w-full mt-1 gap-x-2">
		<Button
			index={0}
			type="email"
			bind:selectedIndex
			title="Send by Email"
			subtitle="Send this set directly to another operator's email address"
		/>
		<Button
			index={1}
			type="download"
			bind:selectedIndex
			title="Download Locally"
			subtitle="Save a .json file to your device"
		/>
	</div>

	<div class="flex justify-center py-2">
		<div class="w-full border-b border-border_accent"></div>
	</div>

	{#if selectedIndex === 0}
		<p class="text-form_title text-[0.75rem] font-serif">Recipient email address</p>
		<input
			bind:value={email}
			class="w-full h-11 px-3 mb-2 bg-light_grey/8 border border-border_accent rounded outline-none"
		/>

		<FooterButton action="Send" disabledCondition={!validEmail} eventHandler={() => {}} />
	{:else}
		<div
			class="flex flex-row items-center px-3 mb-2 gap-2 w-full h-13 border border-border_accent rounded"
		>
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

			<div class="flex flex-row justify-between w-full">
				<p class="text-[0.8rem] font-serif">{toFileName(selectedSet.name)}</p>
				<p class="text-[0.8rem] font-serif text-light_grey leading-[1.5] tracking-[0.02em]">
					{`${kilobytes} KB`}
				</p>
			</div>
		</div>

		<FooterButton action="Download" disabledCondition={false} eventHandler={exportSet} />
	{/if}
</Modal>
