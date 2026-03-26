<script>
	import { goto, preloadData } from '$app/navigation';
</script>

<div class="cursor-pointer flex flex-col items-center justify-center group">
	<button
		aria-label="go back"
		onclick={() => goto('/')}
		class="flex flex-row justify-center items-center w-9 h-9 rounded-[0.2rem] border-solid border-1 border-border_accent cursor-pointer group-hover:border-accent_btn_hover"
	>
		<svg
			width="11"
			height="11"
			viewBox="0 0 16 16"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			class="text-[#80868b] group-hover:text-neutral-50"
		>
			<path
				d="M11 2 L5 8 L11 14"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
	</button>
</div>
