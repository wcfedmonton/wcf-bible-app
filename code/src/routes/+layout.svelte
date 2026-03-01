<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link
		href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@900&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

{@render children()}
