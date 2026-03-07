<script lang="ts">
	import { getContext } from 'svelte';
	import type { ContextValue } from '$lib/utils';

	const { title, eventHandler } = $props();
	const showEditOptions = getContext<ContextValue<boolean>>('showEditOptions');

	const rewrite = `
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="ml-2 text-extra_light_grey">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>`;

	const trash = `
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="ml-2 text-extra_light_grey">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
        </svg>`;

	const icon = title === 'Rename' ? rewrite : trash;
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
