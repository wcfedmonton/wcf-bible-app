<script lang="ts">
	import { getContext } from 'svelte';
	import type { VerseSet } from '$lib/utils';

	const { prompt, icon } = $props();

	const verseSets = getContext<{ value: VerseSet[] }>('verseSets');
	const currentlySelectedVerseId = getContext<{ value: string }>('selectedVerseSetId');
</script>

<button
	onclick={() => {
		verseSets.value.push({
			id: crypto.randomUUID(), 
			name: 'Untitled',
			verses: []
		});

		if(verseSets.value.length === 1) {
			currentlySelectedVerseId.value = verseSets.value[0].id;
		}
	}}
	class="bg-[#d3413f2e] cursor-pointer flex flex-row justify-center p-[0.3rem] w-22 mt-2 border-solid border-1 rounded-[0.2rem] border-action_btn_border gap-[0.3rem]"
>
	{@html icon}

	<p class="text-[0.7rem] text-[#e0e0e0]">{prompt}</p>
</button>
