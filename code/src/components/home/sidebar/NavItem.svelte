<script lang="ts">
	import { goto, preloadData } from "$app/navigation";

    const { pageTitle, icon, route } = $props();
</script>

<button
    onclick={() => goto(route)}
    onmouseenter={() => preloadData(route)}
    class="cursor-pointer w-full h-11 px-4 flex items-center hover:bg-light_grey/30"
>
    <div class="w-full h-6 ">
        <div class="flex flex-row w-full h-full pl-[0.1rem]">
            <div class="w-7 h-full flex flex-row justify-content items-center">
                {@html icon}
            </div>

            <p class="pl-2 text-form_title">{pageTitle}</p>
        </div>
    </div>
</button>