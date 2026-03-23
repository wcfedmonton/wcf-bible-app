<script lang="ts">
	import Title from '../Title.svelte';
	import Header from '../Header.svelte';
	import Divider from '../Divider.svelte';
	import AuthModal from './AuthModal.svelte';
	import VerseSetsNav from '../nav/VerseSetsNav.svelte';

	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	let { showSidebar = $bindable() } = $props();
</script>

<div
	transition:fly={{ x: -100, duration: 300, easing: cubicOut }}
	class="w-[19%] min-w-[18rem] h-dvh flex flex-col border border-solid border-border_accent bg-[#1a1a1a] shadow-[4px_0_28px_rgba(0,0,0,0.6)]"
>
	<Header bind:showSidebar />

	<AuthModal />

	<Title title="NAVIGATION" />
	<VerseSetsNav disabled={true} />
	<Divider />

	<Title title="VERSE SETS" />

	<div class="flex flex-row justify-center">
		<p class="w-[87%] h-4 pt-2 text-[0.76rem] text-center text-light_grey">
			Sign in to save and manage verse sets across sessions.
		</p>
	</div>
</div>
