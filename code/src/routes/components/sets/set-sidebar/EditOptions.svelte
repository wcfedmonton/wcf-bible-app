<script lang="ts">
	import Option from './Option.svelte';

	import { getContext } from 'svelte';
	import type { ContextValue } from '$lib/utils';
	import type { VerseSet } from '$lib/shared/VerseSet';

	const verseSets = getContext<ContextValue<VerseSet[]>>('verseSets');
	const lastSetToOpenEdit = getContext<ContextValue<string>>('lastSetToOpenEdit');
	const setNameInputDisabled = getContext<ContextValue<boolean>>('setNameInputDisabled');
	const currentlySelectedVerseId = getContext<ContextValue<string>>('selectedVerseSetId');
	let verseSetReference: ContextValue<VerseSet> | null =
		getContext<ContextValue<VerseSet>>('verseSetReference');

	const selectedVerseSet = getContext<ContextValue<VerseSet>>('selectedVerseSet');
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
			const verseSetId = verseSetReference!.value.id;
			const deletedVerseIndex = verseSets.value.findIndex((v) => v.id === verseSetId);
			const isCurrentlySelected = currentlySelectedVerseId.value === verseSetId;

			verseSetReference!.value.delete();
			verseSets.value = verseSets.value.filter((set) => set.id !== verseSetId);

			if (!isCurrentlySelected) return;

			if (verseSets.value.length === 0) {
				currentlySelectedVerseId.value = '';
				verseSetReference = null;
			} else if (deletedVerseIndex === 0) {
				// if the deleted set was first, select the new first set
				currentlySelectedVerseId.value = verseSets.value[0].id;
				verseSetReference!.value = verseSets.value[0];
				selectedVerseSet.value = verseSets.value[0];
			} else {
				// otherwise, select the set directly above the deleted one
				const newSelected = verseSets.value[deletedVerseIndex - 1];
				currentlySelectedVerseId.value = newSelected.id;
				verseSetReference!.value = newSelected;
				selectedVerseSet.value = newSelected;
			}
		}}
	/>
</div>
