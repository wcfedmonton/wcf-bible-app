<script lang="ts">
    import Button from "../Button.svelte";

    const { selectedVerseSet = $bindable() } = $props();

    const arrowUp = `
        <svg width=16 height=16 viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#e0e0e0"">
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier"><path d="M12 18V3.707L9.354 6.354l-.707-.707L12.5 1.793l3.854 3.854-.707.707L13 3.707V18zm5-2h4v5H4v-5h4v-1H3v7h19v-7h-5z"></path>
            <path fill="none" d="M0 0h24v24H0z"></path></g>
        </svg>`;
</script>

<div class="flex flex-col justify-center items-center w-full h-[6.25rem] border-solid border-b-1 border-border_accent">
    <div class="flex flex-row justify-between w-[94%] h-[3.2rem]">
        <div class="flex flex-col  gap-1">
            <p class="font-serif text-3xl italic">{selectedVerseSet?.name}</p>
            <p class="text-[0.8rem] text-light_grey">Last edited {selectedVerseSet?.lastEdited}</p>
        </div>

        <div class="flex flex-row justify-end h-[2.6rem]">
            <Button prompt="Export" icon={arrowUp} eventHandler={() => {}}/>
        </div>
    </div>
</div>