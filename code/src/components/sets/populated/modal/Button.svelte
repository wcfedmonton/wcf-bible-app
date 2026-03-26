<script lang="ts">
    const { action, disabledCondition, eventHandler = null } = $props();
</script>

<div class="flex mt-auto justify-end items-end w-full">
    <button 
        onclick={eventHandler}
        disabled={disabledCondition}
        class="cursor-pointer w-30 h-10 rounded font-sans font-serif font-semibold bg-accent_btn hover:bg-accent_btn_hover disabled:bg-accent_btn_hover/30 disabled:text-white/70 disabled:cursor-not-allowed"
    >
        {action}
    </button>
</div>