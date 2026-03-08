<script lang="ts">
    import Empty from "./populated/Empty.svelte";
    import Search from "./populated/search/Search.svelte";
    import Header from "./populated/Header.svelte";
    import SearchResults from "./populated/search/SearchResults.svelte";

    import { getContext } from "svelte";
    import type { ContextValue, Verse, VerseSet } from "$lib/utils";

    const searchQuery = getContext<ContextValue<string>>("searchQuery");
    const verseSets = getContext<ContextValue<VerseSet[]>>("verseSets");
    const selectedVerseSetId = getContext<ContextValue<string>>("selectedVerseSetId");
    let selectedVerseSet = $derived(verseSets.value.find(set => set.id === selectedVerseSetId.value));

    const searchResults = $derived(getContext<ContextValue<Verse[]>>("searchResults"));
    //  svelte/state_referenced_locally
    let queryCopy = $state(""); // we use a copy of the string so that the search results header stays consisten with the results
</script>

<div class="class=flex flex-col justify-center items-center w-full h-dvh">
    <Header bind:selectedVerseSet />
    <Search bind:searchQuery={searchQuery.value} bind:queryCopy/>
    
    {#if selectedVerseSet?.verses.length === 0 && verseSets.value.length !== 0 && searchResults.value.length === 0} <!-- the second check is to ensure the two screens don't show at the same time -->
        <Empty />
    {:else if searchResults.value.length > 0}
        <SearchResults searchQuery={queryCopy} />
     {/if}
</div>
