<script lang="ts">
	import EditOptions from './EditOptions.svelte';

	import { getContext } from 'svelte';
	import type { ContextValue } from '$lib/utils';

	const { setId } = $props();
	const lastSetToOpenEdit = getContext<ContextValue<string>>('lastSetToOpenEdit');
</script>

<div class="relative">
	<button
		aria-label="show more options"
		class="cursor-pointer text-light_grey hover:text-white"
		onclick={(e) => {
			e.stopPropagation();

			lastSetToOpenEdit.value = lastSetToOpenEdit.value === setId ? '' : setId;
		}}
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			fill="currentColor"
			class="bi bi-three-dots"
			viewBox="0 0 16 16"
		>
			<path
				d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"
			/>
		</svg>
	</button>

	{#if lastSetToOpenEdit.value === setId}
		<EditOptions />
	{/if}
</div>
