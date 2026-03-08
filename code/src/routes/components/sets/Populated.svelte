<script lang="ts">
    import Search from "./populated/Search.svelte";
    import Header from "./populated/Header.svelte";
    import Empty from "./populated/Empty.svelte";

    import { getContext } from "svelte";
    import type { ContextValue, VerseSet } from "$lib/utils";

    let searchQuery = $state("");
    const verseSets = getContext<ContextValue<VerseSet[]>>("verseSets");
    const selectedVerseSetId = getContext<ContextValue<string>>("selectedVerseSetId");
    let selectedVerseSet = $derived(verseSets.value.find(set => set.id === selectedVerseSetId.value));
</script>

<div class="class=flex flex-col justify-center items-center w-full h-dvh">
    <Header bind:selectedVerseSet />
    <Search bind:searchQuery />
    
    {#if selectedVerseSet?.verses.length === 0 && verseSets.value.length !== 0} <!-- the second check is to ensure the two screens don't show at the same time -->
        <Empty />
    {/if}
    <!-- searchQuery will also be passed to component that displays results -->
</div>
