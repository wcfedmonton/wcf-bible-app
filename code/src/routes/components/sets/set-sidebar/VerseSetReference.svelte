<script lang="ts">
	import Edit from './Edit.svelte';
	import Name from './Name.svelte';

	import { getContext, setContext } from 'svelte';
	import type { ContextValue, VerseSet, Verse } from '$lib/utils';

	let { set = $bindable() } = $props<{ set: VerseSet }>();
	setContext('verseSetReference', { value: set });
	const verseSetReference = getContext<ContextValue<VerseSet>>('verseSetReference');

	let setNameInputDisabled = $state({ value: true });
	setContext('setNameInputDisabled', setNameInputDisabled);

	const selectedVerseSetId = getContext<ContextValue<string>>('selectedVerseSetId');
	let selected = $derived(set.id === selectedVerseSetId.value);

	const lastSetToOpenEdit = getContext<{ value: any }>('lastSetToOpenEdit');

	const searchResults = getContext<ContextValue<Verse[]>>("searchResults");

	const searchQuery = getContext<ContextValue<string>>("searchQuery");
</script>

<svelte:window
	onclick={() => {
		lastSetToOpenEdit.value = '';
		verseSetReference.value = set;
	}}
/>

<div
	role="button"
	tabindex="0"
	onclick={() => {
		selectedVerseSetId.value = set.id;
		// clear the search results shown (if any), so that they don't interfere with the new verse set's state
		searchResults.value = []; 
		
		searchQuery.value = ""; // clear the search query
	}}
	onkeydown={(e) => e.key === 'Enter' && (selected = !selected)}
	class:border-l-2={selected}
	class:border-l-accent_btn={selected}
	class:bg-verse_set_selected={selected}
	class={`flex justify-center items-center cursor-pointer border-b-1 border-solid border-border_accent w-full h-[10%] max-h-19 min-h-19 hover:${selected ? 'bg-verse_set_selected' : 'bg-[#333333]'}`}
>
	<Name bind:set />

	<Edit setId={set.id} />
</div>
