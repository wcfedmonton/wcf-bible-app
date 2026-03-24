<script lang="ts">
    type Props = {
		modalTitle: string;
		children: import('svelte').Snippet;
	};

    const { modalTitle, children }: Props = $props();
</script>

<div class="relative flex justify-center items-center w-full h-dvh bg-black/50">
    <div class="w-[28%] h-fit rounded border border-border_accent bg-[#222222]">
        <!-- header -->
        <div class="flex justify-center items-center w-full h-[14%] py-4 border-b border-b-border_accent rounded-tl rounded-tr">
            <p class="w-[89%] h-[40%] text-xl font-serif font-semibold">
                {modalTitle}
            </p>
        </div>

        <!-- body -->
        {@render children()}
    </div>
</div>