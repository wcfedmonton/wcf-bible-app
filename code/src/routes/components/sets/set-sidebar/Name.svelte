<script lang="ts">
	import { getContext } from 'svelte';

	let { title = $bindable(), verseCount } = $props();

	const wildCardDisabled = getContext<{ value: boolean }>('wildCardDisabled');
	const setNameInputDisabled = getContext<{ value: boolean }>('setNameInputDisabled');
</script>

<div class="flex flex-col items-start w-[88%] min-w-55 h-10">
	<input
		class={`cursor-pointer font-serif w-[95%] h-7 px-2 rounded-sm outline-none ${!setNameInputDisabled.value ? 'bg-[#222222] border border-solid border-input_focus focus:border-input_focus' : ''}`}
		bind:value={title}
		minlength={1}
		maxlength={35}
		disabled={setNameInputDisabled.value}
		onclick={(e) => e.stopPropagation()}
		onkeydown={(e) => {
			if (e.key === 'Enter') {
				e.stopPropagation();

				setNameInputDisabled.value = title.length > 0 ? true : false;
				wildCardDisabled.value = setNameInputDisabled.value ? true : false; // prevent an 'empty' name from being saved
				// NOTE: this is where we'll check the value of setInputDisabled before sending a post request
			}
		}}
	/>
	<p class="px-2 text-[0.7rem] text-light_grey">{verseCount + ' verses'}</p>
</div>
