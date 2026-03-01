<script lang="ts">
	type Props = {
		cardTitle: string;
		children: import('svelte').Snippet;
	};

	const { cardTitle, children }: Props = $props();
</script>

<div
	class=" w-[24.25rem] items-center bg-card_grey border-solid border rounded-md border-border px-14 py-7 mb-0"
>
	<p class="font-serif text-[2rem] text-center font-black mb-6 text-white">{cardTitle}</p>

	{@render children()}
</div>