<script lang="ts">
	import Logo from '../../common/Logo.svelte';

	let { showSidebar = $bindable() } = $props();
</script>

<div
	class="w-full h-16 flex flex-row justify-between items-center px-3 border-b border-border_accent"
>
	<div class="flex flex-row justify-start">
		<div class="flex flex-row w-32 scale-100 ml-[-.2rem] pr-17">
			<Logo />
		</div>
	</div>

	<div class="flex flex-row justify-end w-[50%]">
		<button
			aria-label="Close menu"
			onclick={() => (showSidebar = !showSidebar)}
			class="cursor-pointer flex flex-row justify-center items-center w-8 h-8 rounded hover:bg-[#9198a1]/10"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				fill="currentColor"
				class="bi bi-x"
				viewBox="0 0 16 16"
			>
				<path
					d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"
				/>
			</svg>
		</button>
	</div>
</div>
