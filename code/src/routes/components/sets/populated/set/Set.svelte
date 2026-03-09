<script lang="ts">
	import type { VerseSet } from "$lib/utils";
    import Buttons from "./Buttons.svelte";

    const { selectedVerseSet = $bindable() }: { selectedVerseSet: VerseSet } = $props();
    
    const noResultsHeight = ""; // test out the heights for each number of search results and then decide which to use using $derived
</script>

<div class="flex flex-col items-center pt-3">
    <div class="flex w-[94%]">
        <p class="text-[0.7rem] text-[#777a7d] tracking-wider">CURRENT VERSES IN SET</p>
    </div>
</div>

<div class="flex flex-col items-center w-full h-[calc(100vh-13rem)] pt-3 "> <!-- fixed height doesn't work for bigger screens -->
    <div class="flex-1 w-[94%] border-b-border_accent overflow-auto scrollbar-black">
        {#each selectedVerseSet.verses as verse, index }
            <div class="grid grid-cols-[auto_1fr_auto] w-full gap-x-2">
                <p class="text-light_grey row-start-1">{index + 1 + "."}</p>
                <p class="text-[0.9rem] text-[#e05250] font-medium font-serif italic row-start-1">{`${verse.verseReference} (${verse.translation})`}</p>
            <div class="row-start-1"><Buttons /></div>

            <!-- empty cell for number column, verse text aligns with col 2 -->
            <span></span>
            <p class="col-start-2 col-span-2 pr-3 pb-3 mt-1 text-[.82rem] text-[#f0e6e6] font-serif">
                {verse.text}
            </p>
        </div>
            <div class="pb-3">
                <div class="border-b border-b-border_accent"></div> <!-- divider -->
            </div>
        {/each}
    </div>
</div>