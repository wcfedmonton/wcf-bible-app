<script lang="ts">
	import Empty from '../components/sets/Empty.svelte';
	import Populated from '../components/sets/Populated.svelte';
	import SetsSidebar from '../components/sets/Sidebar.svelte';
	import GeneralSidebar from '../components/common/Sidebar.svelte';

	import { setContext } from 'svelte';

	const { data } = $props();
	// svelte-ignore state_referenced_locally
	const verseSets = $state({ value: data.data });
	setContext('verseSets', verseSets);

	const empty = $derived(verseSets.value.length === 0); // will be replaced with a condition checking for the number of verse sets the user has
</script>

<div class="flex min-h-dvh">
	<GeneralSidebar />
	<SetsSidebar />

	{#if empty}
		<Empty />
	{:else}
		<Populated />
	{/if}
</div>
