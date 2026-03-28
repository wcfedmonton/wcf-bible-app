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
			onkeydown={async (e) => {
				e.stopPropagation();

				if (e.key === 'Enter' && newName.trim() !== '') {
					const index = verseSets.value.findIndex((s) => s.id === set.id);

					if (index !== -1) {
						await set.saveVerseSet(newName);
						verseSets.value[index] = new VerseSet(set.id, newName, set.lastEdited, set.verses);
						selectedVerseSet.value = new VerseSet(set.id, newName, set.lastEdited, set.verses);
					}

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
