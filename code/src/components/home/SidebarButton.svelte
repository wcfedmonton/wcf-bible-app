<script lang="ts">
    let { showSidebar = $bindable() } = $props();
</script>

 <button
    aria-label="Open panel"
    onclick={() => showSidebar = !showSidebar }
    class="group cursor-pointer flex items-center justify-center w-9 h-9 m-4 border border-border_accent border-1 rounded-sm bg-sidebar_bg hover:border-accent_btn_hover"
>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="20" height="20">
        <line x1="15" y1="25" x2="85" y2="25" stroke="black" stroke-width="8" stroke-linecap="round" class="stroke-light_grey group-hover:stroke-neutral-50"/>
        <line x1="15" y1="50" x2="85" y2="50" stroke="black" stroke-width="8" stroke-linecap="round" class="stroke-light_grey group-hover:stroke-neutral-50"/>
        <line x1="15" y1="75" x2="85" y2="75" stroke="black" stroke-width="8" stroke-linecap="round" class="stroke-light_grey group-hover:stroke-neutral-50"/>
    </svg>
</button>