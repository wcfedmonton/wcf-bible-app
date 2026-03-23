<script lang="ts">
	import Title from './Title.svelte';

	let {
		title,
		value = $bindable(),
		error = $bindable()
	}: {
		title: string;
		value: string;
		error?: string;
	} = $props();
</script>

<div class="mb-5">
	<Title {title} />
	<input
		bind:value
		type="text"
		name={title}
		class="w-full bg-form_input border border-input_border border-solid rounded py-2 px-4 hover:border-input_focus focus:outline-none focus:ring-0 focus:input-focus"
	/>

	{#if error}
		<div class="py-2">
			<p class="absolute text-[0.8rem] text-error_red">{error}</p>
		</div>
	{/if}
</div>
