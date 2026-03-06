<script lang="ts">
    import Empty from "../components/sets/Empty.svelte";
    import SetsSidebar from "../components/sets/Sidebar.svelte"
    import GeneralSidebar from "../components/common/Sidebar.svelte";

    const empty = true; // will be replaced with a condition checking for the number of verse sets the user has
</script>

<div class="flex min-h-dvh">
    <GeneralSidebar />
    <SetsSidebar />
    
    {#if empty}
        <Empty />
    {/if}
</div>