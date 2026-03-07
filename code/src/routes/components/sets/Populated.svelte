<script lang="ts">
    import Search from "./populated/Search.svelte";
    import Header from "./populated/Header.svelte";

    let searchQuery = $state("");
</script>

<div class="class=flex flex-col justify-center items-center w-full h-dvh">
    <Header />
    <Search bind:searchQuery />

    <!-- searchQuery will also be passed to component that displays results -->
</div>
