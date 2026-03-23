<script lang="ts">
	const { prompt, icon, eventHandler } = $props();
</script>

<button
	onclick={eventHandler}
	class="bg-[#d3413f2e] cursor-pointer flex flex-row justify-center p-[0.3rem] w-[6rem] mt-2 border-solid border-1 rounded-[0.2rem] border-action_btn_border gap-[0.3rem]"
>
	{@html icon}

	<p class="text-[85%] text-[#e0e0e0]">{prompt}</p>
</button>
