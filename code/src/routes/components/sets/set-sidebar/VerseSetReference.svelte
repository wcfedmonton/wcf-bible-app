<script lang="ts">
	import Edit from './Edit.svelte';
	import Name from './Name.svelte';

	import { getContext, setContext } from 'svelte';
	import type { VerseSet } from '$lib/utils';

	const { set = $bindable() } = $props<{ set: VerseSet }>();
	setContext('verseSetReference', { value: set });
	const verseSetReference = getContext<{ value: VerseSet }>('verseSetReference');

	let showEditOptions = $state({ value: false });
	setContext('showEditOptions', showEditOptions);

	let setNameInputDisabled = $state({ value: true });
	setContext('setNameInputDisabled', setNameInputDisabled);

	// this will be used as a safeguard for any cases where it's not feasible to
	// keep track of state using props
	let wildCardDisabled = $state({ value: true });
	setContext('wildCardDisabled', wildCardDisabled);

	const selectedVerseSetId = getContext<{ value: string }>('selectedVerseSetId');
	let selected = $derived(set.id === selectedVerseSetId.value);
</script>

<svelte:window
	onclick={() => {
		verseSetReference.value = set;
		showEditOptions.value = false;
		setNameInputDisabled.value = wildCardDisabled.value;
	}}
/>

<div
	role="button"
	tabindex="0"
	onclick={() => {
		selectedVerseSetId.value = set.id;
	}}
	onkeydown={(e) => e.key === 'Enter' && (selected = !selected)}
	class:border-l-2={selected}
	class:border-l-accent_btn={selected}
	class:bg-verse_set_selected={selected}
	class={`flex justify-center items-center cursor-pointer border-b-1 border-solid border-border_accent w-full h-[10%] max-h-19 min-h-18 hover:${selected ? 'bg-verse_set_selected' : 'bg-[#333333]'}`}
>
	<Name bind:title={set.name} verseCount={set.verses.length} />

	<Edit setId={set.id} />
</div>
