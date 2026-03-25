<script lang="ts">
    const { title, subtitle, type } = $props();
</script>

<button
    class="cursor-pointer flex flex-col items-center gap-3 w-[50%] py-[1.37rem] px-[1.13rem] rounded-sm border-[0.08rem] border-light_grey hover:border-accent_btn text-center"
>
    <div class="flex justify-center items-center w-11 h-11 rounded-full border border-action_btn_border bg-[#d3413f2e]">
        {#if type === "email"}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="stroke-accent_btn">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
        {:else}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" class="stroke-accent_btn">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
        {/if}
    </div>

    <div>
        <p class="font-serif text-[0.85rem] text-primary mb-1">{title}</p>
        <p class="font-serif text-[0.65rem] text-light_grey leading-[1.5] tracking-[0.02em]">{subtitle}</p>
    </div>
</button>