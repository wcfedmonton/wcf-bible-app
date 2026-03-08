<script lang="ts">
	import { getContext } from "svelte";
    import { getTranslations, type ContextValue, type Verse } from "$lib/utils";

    let { searchQuery = $bindable(), queryCopy = $bindable() } = $props();
    let selectedTranslation = $state("NIV"); // will be set to user's default translation
    
    let open = $state(false)
    const translations: string[] = $derived(open ? getTranslations() : [selectedTranslation]);

    let loading = $state(false);

    const searchResults = getContext<ContextValue<Verse[]>>("searchResults");

    function returnDummyData() {
        return [
            {
            text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life. For God so loved the world",
            verseReference: "John 3:16 (NIV)"
        },
        {
           text: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not faint.",
           verseReference: "Isaiah 40:31 (NIV)"
        },
        {
            text: "I can do all this through him who gives me strength, for I know that nothing is impossible with God, and his grace is sufficient for all who call upon him.",
            verseReference: "Philippians 4:13 (NIV)"
        }
        ];
    }
</script>

<div class="flex flex-row justify-center items-start">
    <div class="relative w-[7%] mt-[1.2rem]">
        <!-- currently selected translation -->
        <div
            role="button"
            tabindex="0"
            onclick={() => open = !open}
            onkeydown={(e) => e.key === 'Enter' || e.key === ' ' ? open = !open : null}
            class="cursor-pointer h-[2.48rem] w-full rounded-tl rounded-bl border-solid border-l border-y border-accent_btn border-r border-r-border_accent outline-none text-sm text-center bg-form_input flex items-center justify-end pr-2"
        >
            <button class="cursor-pointer flex flex-col justify-center items-center w-full outline-none ">
                <p class="text-center">{selectedTranslation}</p>
            </button>

            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 9l6 6l6 -6" />
            </svg>
        </div>

        {#if open} <!-- display dropdown -->
            <div class="absolute top-full left-0 w-full h-60 overflow-y-auto scrollbar-black border border-solid border-border_accent bg-form_input text-sm text-center z-50">
                {#each translations as translation}
                    <button
                        onclick={() => { selectedTranslation = translation; open = false }}
                        class="cursor-pointer flex flex-col justify-center items-center h-[2.48rem] w-full hover:bg-[#444444]"
                    >
                        {translation}
                    </button>
                {/each}
            </div>
        {/if}
    </div>

    <input 
        bind:value={searchQuery}
        disabled={loading} // requests will not be allowed while another request is being resolved to avoid race conditions
        onkeydown={({ key }) => {
            if(key === "Enter" && searchQuery.trim() !== "") {
                loading = true;
                queryCopy = searchQuery;
                // POST request will be made here using the search query
                setTimeout(() => loading = false, 2000)
                searchResults.value.splice(0, searchResults.value.length, ...returnDummyData());
            }
        }}
        class="w-[87%] h-[2.48rem] mt-[1.2rem] pl-3 pr-7 rounded-tr rounded-br border-y border-r border-solid border-accent_btn outline-none bg-form_input"
    />

    {#if loading} <!-- display spinner -->
        <div class="absolute flex flex-start right-10 mt-[1.2rem] items-center h-[2.48rem] animate-spin">
            <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-loader">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M12 6l0 -3" /><path d="M16.25 7.75l2.15 -2.15" /><path d="M18 12l3 0" /><path d="M16.25 16.25l2.15 2.15" />
                <path d="M12 18l0 3" /><path d="M7.75 16.25l-2.15 2.15" /><path d="M6 12l-3 0" />
                <path d="M7.75 7.75l-2.15 -2.15" />
            </svg>
        </div>
    {/if}
</div>

<div class="flex justify-center">
    <div class="w-[94%] mt-[1.2rem] border-b border-border_accent"></div>
</div>