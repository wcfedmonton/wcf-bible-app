<script>
	import { goto, preloadData } from "$app/navigation";
</script>

<div class="cursor-pointer flex flex-col items-center justify-center group">
	<button
		aria-label="go back"
		onclick={() => goto("/")}
		onmouseenter={() => preloadData("/")}
		class="flex flex-row justify-center items-center w-9 h-9 rounded-[0.2rem] border-solid border-1 border-border_accent cursor-pointer group-hover:border-accent_btn_hover"
	>
		<svg
			width="11"
			height="11"
			viewBox="0 0 16 16"
			fill="currentColor"
			xmlns="http://www.w3.org/2000/svg"
			class="bi bi-chevron-left text-[#80868b] group-hover:stroke-neutral-50"
		>
			<path
				fill-rule="evenodd"
				d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"
			/>
		</svg>
	</button>
</div>
