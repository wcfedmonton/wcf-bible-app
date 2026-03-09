<script lang="ts">
	import Option from './Option.svelte';

	import { getContext } from 'svelte';
	import type { VerseSet } from '$lib/utils';
	import type { ContextValue } from '$lib/utils';

	const verseSets = getContext<ContextValue<VerseSet[]>>('verseSets');
	const lastSetToOpenEdit = getContext<ContextValue<string>>('lastSetToOpenEdit');
	const verseSetReference = getContext<ContextValue<VerseSet>>('verseSetReference');
	const setNameInputDisabled = getContext<ContextValue<boolean>>('setNameInputDisabled');
	const currentlySelectedVerseId = getContext<ContextValue<string>>('selectedVerseSetId');
</script>

<div
	class="absolute right-0 z-1 w-[9rem] h-15 mt-[-0.5rem] rounded-sm border-solid border-1 border-border_accent bg-[#222222]"
>
	<Option
		title="Rename"
		eventHandler={() => {
			lastSetToOpenEdit.value = '';
			setNameInputDisabled.value = false;
		}}
	/>
	<Option
		title="Delete"
		eventHandler={() => {
			// capture the id of the set to be deleted before mutating the list
			const verseSetId = verseSetReference.value.id;

			// save the index of the set to be deleted so that we have a reference
			// to toggle the verse set 'above' to the delete set
			const deletedVerseIndex = verseSets.value.findIndex((v) => v.id === lastSetToOpenEdit.value);

			// remove the deleted set from the list
			verseSets.value = verseSets.value.filter((set) => set.id != verseSetId);

			// if the deleted is not the currently selected one, we don't need to make any changes
			// to the selected set
			if (currentlySelectedVerseId.value !== verseSetReference.value?.id) {
				return;
			}

			if (deletedVerseIndex === 0 && verseSets.value.length >= 1) {
				// if the first set is deleted, the one after it becomes selected
				lastSetToOpenEdit.value = verseSetId;
				verseSetReference.value = verseSets.value[0];
				currentlySelectedVerseId.value = verseSets.value[0]?.id;
			} else {
				// if any other set is deleted, the one before it becomes selected
				verseSetReference.value = verseSets.value[deletedVerseIndex - 1];

				// this value will be null in the case where the only set gets deleted
				currentlySelectedVerseId.value = verseSets.value[deletedVerseIndex - 1]?.id;
			}
		}}
	/>
</div>
