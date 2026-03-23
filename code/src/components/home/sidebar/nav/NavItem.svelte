<script lang="ts">
	import { goto, preloadData } from "$app/navigation";

    const { pageTitle, icon, route, disabled } = $props();
</script>

<button
    onclick={() => !disabled ? goto(route) : ""}
    onmouseenter={() => !disabled ? preloadData(route) : ""}
    class="w-full h-11 px-4 flex items-center {!disabled ? "cursor-pointer hover:bg-light_grey/30" : "cursor-not-allowed hover:bg-light_grey/10"}"
>
    <div class="w-full h-6 ">
        <div class="flex flex-row w-full h-full pl-[0.1rem]">
            <div class="w-7 h-full flex flex-row justify-content items-center">
                {@html icon}
            </div>

            <p class="pl-2 {!disabled ? "text-form_title" : "text-[#6b7074]"}">{pageTitle}</p>
        </div>
    </div>
</button>