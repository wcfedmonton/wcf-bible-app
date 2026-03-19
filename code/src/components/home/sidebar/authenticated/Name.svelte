<script lang="ts">
	import { getContext } from "svelte";
    import type { ContextValue } from "$lib/utils";

    const name = getContext<ContextValue<string>>('name');

    const names = name.value.split(' ');
    const initials = names.length > 1 ? names[0][0] + names[1][0] : names[0][0];
</script>

<div class="w-full h-15 border-b border-border_accent">
    <div class="w-full h-full flex flex-row items-center pr-12">
        <div class="w-[25%] h-full flex flex-row justify-end items-center">
            <p class="flex justify-center items-center w-9 h-9 font-serif text-red-400 rounded-full border border-accent_btn_hover bg-[#d3413f2e]">
                {initials}
            </p>
        </div>

        <div class="w-[65%] h-5">
            <p class="pl-2 font-serif text-sm">{name.value}</p>
        </div>
    </div>
</div>