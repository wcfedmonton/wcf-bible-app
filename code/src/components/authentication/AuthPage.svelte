<script lang="ts">
	import Logo from '../common/Logo.svelte';

	const { children }: { children: import('svelte').Snippet } = $props();
</script>

<div class="flex flex-row justify-between items-center min-h-dvh">
	<div class="w-[50%] h-dvh bg-[#1a1a1a] flex flex-row justify-center items-center">
		<Logo />
	</div>
	<div class="w-[50%] h-dvh flex flex-row justify-center items-center">
		{@render children()}
	</div>
</div>
