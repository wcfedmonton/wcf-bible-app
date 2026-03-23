<script lang="ts">
	type Props = {
		cardTitle: string;
		children: import('svelte').Snippet;
	};

	const { cardTitle, children }: Props = $props();
</script>

<div
	class="bg-card_grey border-solid border rounded-md border-border px-14 py-7"
>
	<p class="font-serif text-[2rem] text-center font-black mb-6 text-white">{cardTitle}</p>

	{@render children()}
</div>
