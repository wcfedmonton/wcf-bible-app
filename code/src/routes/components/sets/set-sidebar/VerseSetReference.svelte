<script lang="ts">
	import Edit from './Edit.svelte';
	import Name from './Name.svelte';

	import { getContext, setContext } from 'svelte';
	import { VerseSet } from '$lib/shared/VerseSet';
	import type { ContextValue, Verse } from '$lib/utils';

	let { set = $bindable() } = $props<{ set: VerseSet }>();
	setContext('verseSetReference', { value: set });
	const verseSetReference = getContext<ContextValue<VerseSet>>('verseSetReference');

	let setNameInputDisabled = $state({ value: true });
	setContext('setNameInputDisabled', setNameInputDisabled);

	const selectedVerseSetId = getContext<ContextValue<string>>('selectedVerseSetId');
	let selected = $derived(set.id === selectedVerseSetId.value);

	const searchQuery = getContext<ContextValue<string>>('searchQuery');
	const searchResults = getContext<ContextValue<Verse[]>>('searchResults');
	const lastSetToOpenEdit = getContext<ContextValue<string>>('lastSetToOpenEdit');
	const viewingSearchResults = getContext<ContextValue<boolean>>('viewingSearchResults');
</script>

<svelte:window
	onclick={() => {
		lastSetToOpenEdit.value = '';
		verseSetReference.value = set;
		setNameInputDisabled.value = true;
		viewingSearchResults.value = false;
	}}
/>

<div
	role="button"
	tabindex="0"
	onclick={() => {
		selectedVerseSetId.value = set.id;
		// clear the search results shown (if any), so that they don't interfere with the new verse set's state
		searchResults.value = [];

		searchQuery.value = ''; // clear the search query
	}}
	onkeydown={(e) => e.key === 'Enter' && (selected = !selected)}
	class:border-l-2={selected}
	class:border-l-accent_btn={selected}
	class:bg-verse_set_selected={selected}
	class={`flex justify-center items-center cursor-pointer border-solid border-border_accent border-b w-full h-[10%] max-h-19 min-h-19 hover:${selected ? 'bg-verse_set_selected' : 'bg-[#333333]'}`}
>
	<Name bind:set />

	<Edit setId={set.id} />
</div>
