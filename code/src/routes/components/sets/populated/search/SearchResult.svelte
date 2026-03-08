<script lang="ts">
    import Button from "../../Button.svelte";

    import { getContext } from "svelte";
	import type { Verse, ContextValue, VerseSet } from "$lib/utils";

    const { searchResult, index }: { searchResult: Verse, index: number } = $props();
    
    const searchResults = getContext<ContextValue<VerseSet[]>>("searchResults");    
    const showBottomBorder = $derived(index < searchResults.value.length - 1);

    const add = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg w-[0.6rem] text-[#e0e0e0]" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
        </svg>`;
</script>

<div class="flex flex-between px-4 justify-center items-center w-full h-[4.7rem] {showBottomBorder ? "border-b border-b-border_accent": ""}">
    <div class="w-[97%]">
        <p class="text-[0.9rem] text-[#e05250] font-medium font-serif italic">{searchResult.verseReference + ` (${searchResult.translation})`}</p>
        <p class="w-[97%] text-[.82rem] text-[#f0e6e6] font-serif">
            {searchResult.text.slice(0, 145).trim() + "..."}
        </p>
    </div>

    <div class="flex flex-row justify-end items-center h-[2.6rem]">
        <Button 
            icon={add}
            prompt="Add" 
            eventHandler={() => {
                console.log(searchResult); // this is where we'll add the verse to the set. think about integration w db
            }} 
        />
    </div>
</div>