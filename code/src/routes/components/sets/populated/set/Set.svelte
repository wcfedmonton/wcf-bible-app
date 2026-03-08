<script lang="ts">
    import Buttons from "./Buttons.svelte";

    const { selectedVerseSet = $bindable() } = $props();
    $inspect(selectedVerseSet)
</script>

<div class="flex flex-col items-center pt-3">
    <div class="flex w-[94%]">
        <p class="text-[0.7rem] text-[#777a7d] tracking-wider">CURRENT VERSES IN SET</p>
    </div>
</div>

<div class="flex flex-col items-center w-full  pt-3">
    <div class="w-[94%] ">
        <div class="w-full flex flex-row justify-between">
            <p class="pr-2 text-light_grey">1.</p>
            <p class="w-full text-[0.9rem] text-[#e05250] font-medium font-serif italic">John 14:27 (NIV)</p>

            <!-- will accept verse set as argument to perform actions -->
            <Buttons />
        </div>
        <p class="pl-[1.1rem] pr-3 mt-1 w-full text-[.82rem] text-[#f0e6e6] font-serif">
            {selectedVerseSet.verses[0].text}
        </p>
    </div>
</div>