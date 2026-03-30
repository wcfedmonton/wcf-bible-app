<script lang="ts">
	import Set from './Set.svelte';

	import { getContext } from 'svelte';
	import type { VerseSet } from '$lib/utils';
	import type { ContextValue } from '$lib/utils';

	let { showSidebar = $bindable() } = $props();

	const allSets = getContext<ContextValue<VerseSet[]>>('verseSets');

	let sets = $derived([...allSets.value].sort((a, b) => a.name.localeCompare(b.name)));

	let selectedSetIndex = $state(getContext<ContextValue<number>>('selectedSetIndex'));
</script>

<div class="w-full flex flex-col overflow-auto h-[calc(100vh-21rem)] scrollbar-black">
	{#each sets as set, index (index)}
		<Set
			{index}
			bind:selectedIndex={selectedSetIndex}
			bind:showSidebar
			bind:sortedSetList={sets}
			{set}
		/>
	{/each}
</div>
