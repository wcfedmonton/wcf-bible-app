<script lang="ts">
	import { getContext } from 'svelte';
	import type { ContextValue } from '$lib/utils';
	import { VerseSet } from '$lib/VerseSet';

	let { set = $bindable() }: { set: VerseSet } = $props();

	const verseSets = getContext<ContextValue<VerseSet[]>>('verseSets');
	const selectedVerseSet = getContext<ContextValue<VerseSet>>('verseSetReference');

	let newName = $state(set.name);
	const setNameInputDisabled = getContext<ContextValue<boolean>>('setNameInputDisabled');
</script>

<div class="flex flex-col items-start w-[88%] min-w-55 h-10">
	{#if !setNameInputDisabled.value}
		<input
			class={` font-serif w-[94%] h-7 mx-1 px-1 rounded-sm outline-none ${!setNameInputDisabled.value ? 'bg-[#222222] border border-solid border-input_focus focus:border-input_focus' : ''}`}
			bind:value={newName}
			minlength={1}
			maxlength={30}
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => {
				e.stopPropagation();

				if (e.key === 'Enter' && newName.trim() !== '') {
					// verify that the new name is not an empty string
					// reassign the context object, so it tracks the new values
					const index = verseSets.value.findIndex((s) => {
						if (set.id === s.id) {
							set.saveVerseSet(newName);

							return true;
						}
					});
					verseSets.value[index] = new VerseSet(set.id, newName, set.lastEdited, set.verses);

					// we have to reassing the object to trigger a re-render
					selectedVerseSet.value = new VerseSet(set.id, newName, set.lastEdited, set.verses);

					setNameInputDisabled.value = true;
				}
			}}
		/>
	{:else}
		<p
			class={`cursor-pointer font-serif w-[95%] h-7 pl-1 rounded-sm outline-none ${!setNameInputDisabled.value ? 'bg-[#222222] border border-solid border-input_focus focus:border-input_focus' : ''}`}
		>
			{set.name}
		</p>
	{/if}
	<p class="pl-1 text-[0.7rem] text-light_grey">
		{selectedVerseSet.value.verses.length +
			`${selectedVerseSet.value.verses.length === 1 ? ' verse' : ' verses'}`}
	</p>
</div>
