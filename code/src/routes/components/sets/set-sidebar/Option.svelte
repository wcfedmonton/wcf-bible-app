<script lang="ts">
	import { getContext } from 'svelte';

	let { title, eventHandler, icon = $bindable() } = $props();
	const showEditOptions = getContext<{ value: boolean }>('showEditOptions');
</script>

<button
	onclick={(e) => {
		eventHandler();
		e.stopPropagation();

		showEditOptions.value = !showEditOptions.value;
	}}
	class="cursor-pointer w-full h-[50%] flex flex-row items-center gap-3 hover:bg-[#333333]"
>
	{@html icon}

	<p class="text-extra_light_grey">{title}</p>
</button>
