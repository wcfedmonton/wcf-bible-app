<script lang="ts">
    import Set from "./Set.svelte";

    const sets = [ // will use context variable declared in page.svelte
        { name: "Easter Sunday 2025" },
        { name: "Good Friday 2025" },
        { name: "Pentecost Sunday 2025" },
        { name: "Ash Wednesday 2025" },
        { name: "Palm Sunday 2025" },
        { name: "Maundy Thursday 2025" },
        { name: "Christmas Eve 2024" },
        { name: "New Year's Eve Worship" },
        { name: "Thanksgiving Praise Night" },
        { name: "Advent Week 1: Hope" },
        { name: "Advent Week 2: Peace" },
        { name: "Advent Week 3: Joy" },
        { name: "Advent Week 4: Love" },
        { name: "Sunday: Faith Over Fear" },
        { name: "Sunday: Walking on Water" },
        { name: "Sunday: The Prodigal Son" },
        { name: "Sunday: Fruit of Spirit" },
        { name: "Sunday: Sermon on Mount" },
        { name: "Sunday: Comfort & Hope" },
        { name: "Sunday: Love Your Neighbour" },
    ];
    
    let selectedIndex = $state(-1);
</script>

<div class="w-full flex flex-col overflow-auto h-[calc(100vh-21rem)] scrollbar-black">
    {#each sets as set, index }
        <Set index={index} bind:selectedIndex set={set}/>
    {/each}
</div>