<script lang="ts">
    let { index, selectedIndex = $bindable(), set } = $props(); 

    let selected = $derived(selectedIndex.value === index);
</script>

<button
    onclick={() => {
        selectedIndex.value = index;
    }}
    class="cursor-pointer w-full h-11 px-5 flex justify-center items-center hover:bg-light_grey/30"
>
    <div class="w-[95%] h-full flex flex-row justify-start items-center">
        {#if selected}
            <div class="rounded-full w-[0.35rem] h-[0.35rem] mr-3 bg-red-400"></div>    
        {/if}

        <p class="font-serif text-form_title text-[0.85rem] {selected ? "text-red-400": "text-form_title"}">{set.name}</p>
    </div>
</button>