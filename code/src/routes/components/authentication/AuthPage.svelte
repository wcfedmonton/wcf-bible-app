<script lang="ts">
	import Logo from '../common/logo.svelte';

	const { children }: { children: import('svelte').Snippet } = $props();
</script>

<div class="flex flex-col justify-center items-center min-h-dvh py-8 gap-7">
	<div>
		<Logo />
	</div>

	{@render children()}
</div>
