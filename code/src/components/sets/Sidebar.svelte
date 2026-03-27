<script lang="ts">
	import Button from './Button.svelte';
	import VerseSetReference from './set-sidebar/VerseSetReference.svelte';

	import { VerseSet } from '$lib/VerseSet';
	import { getContext, setContext } from 'svelte';
	import { getDate, type ContextValue } from '$lib/utils';

	const add = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg w-[0.6rem] text-[#e0e0e0]" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
        </svg>`;

	const download = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-plus-lg w-[0.6rem] text-[#e0e0e0]" viewBox="0 0 16 16">
            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"/>
            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"/>
        </svg>`;

	let { showImportModal = $bindable() } = $props();
	const allSets = getContext<ContextValue<VerseSet[]>>('verseSets');

	const sets = $derived(
		[...allSets.value].sort((a, b) => {
			if (new Date(a.lastEdited) > new Date(b.lastEdited)) {
				return -1;
			} else if (new Date(a.lastEdited) < new Date(b.lastEdited)) {
				return 1;
			} else {
				return a.name.localeCompare(b.name);
			}
		})
	);

	const selectedVerseSetId = $state(getContext<ContextValue<string>>('selectedVerseSetId'));
	
	if (!selectedVerseSetId.value && sets.length > 0) {
		selectedVerseSetId.value = sets[0].id;
	}

	const lastSetToOpenEdit = $state({ value: '' });
	setContext('lastSetToOpenEdit', lastSetToOpenEdit);

	async function addVerseSet() {
		// request to send a new verse will be created here
		const newSet = new VerseSet(crypto.randomUUID(), 'Untitled', getDate(), []);

		newSet.saveVerseSet();
		allSets.value.push(newSet);

		if (sets.length === 1) {
			// handles the case for selection when the user adds their first verse set
			selectedVerseSetId.value = sets[0].id;
		}
	}
</script>

<div class="w-[28%] min-w-70 min-h-dvh max-h-dvh border-solid border-r-1 border-r-border_accent">
	<div class="w-full h-25 flex justify-center items-center border-b-1 border-b-border_accent">
		<div class="w-[91%] h-[20%] flex flex-col justify-center">
			<p class="text-[0.7rem] text-[#777a7d] tracking-wider">ALL SETS</p>

			<div class="flex flex-row justify-between">
				<Button eventHandler={addVerseSet} prompt="New Set" icon={add} />
				<Button eventHandler={() => showImportModal = true} prompt="Import Set" icon={download} />
			</div>
		</div>
	</div>

	<div class="overflow-auto h-[calc(100vh-6.25rem)] scrollbar-black">
		{#each sets as set, index (set)}
			<VerseSetReference set={sets[index]} />
		{/each}
	</div>
</div>
