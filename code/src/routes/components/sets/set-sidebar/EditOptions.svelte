<script lang="ts">
	import Option from './Option.svelte';

	import { getContext } from 'svelte';
	import type { VerseSet } from '$lib/utils';

	const verseSets = getContext<{ value: VerseSet[] }>('verseSets');
	const lastSetToOpenEdit = getContext<{ value: string }>('lastSetToOpenEdit');
	const verseSetReference = getContext<{ value: VerseSet }>('verseSetReference');
	const setNameInputDisabled = getContext<{ value: boolean }>('setNameInputDisabled');
	const currentlySelectedVerseId = getContext<{ value: string }>('selectedVerseSetId');
	
	const rewrite = `
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="ml-2 text-extra_light_grey">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>`;

	const trash = `
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="ml-2 text-extra_light_grey">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
        </svg>`;
</script>

<div
	class="absolute right-0 z-1 w-38 h-15 mt-[-0.5rem] rounded-sm border-solid border-1 border-border_accent bg-[#222222]"
>
	<Option
		icon={rewrite}
		eventHandler={() => {
			lastSetToOpenEdit.value = '';
			setNameInputDisabled.value = false;
		}}
		title="Rename"
	/>
	<Option
		icon={trash}
		eventHandler={() => {
			// capture the id of the set to be deleted before mutating the list
			const verseSetId = verseSetReference.value.id;

			// remove the deleted set from the list
			verseSets.value = verseSets.value.filter((set) => set.id != verseSetId);
			
			// if the deleted set was the selected one, fall back to the first set in the list
			if (!verseSets.value.find((v) => v.id === verseSetId)) {
				verseSetReference.value = verseSets.value[0];
				currentlySelectedVerseId.value = verseSetReference.value?.id;
			} else {
				// otherwise, close the menu
				lastSetToOpenEdit.value = verseSetReference.value.id;
			}
		}}
		title="Delete"
	/>
</div>
