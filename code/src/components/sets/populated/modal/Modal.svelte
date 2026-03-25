<script lang="ts">
    type Props = {
        showModal: boolean;
		modalTitle: string;
		children: import('svelte').Snippet;
	};

    let { modalTitle, showModal = $bindable(), children }: Props = $props();
</script>

<div class="relative flex justify-center items-center w-full h-dvh bg-black/50">
    <div class="w-[27rem] max-w-[28rem] h-fit rounded border border-border_accent bg-[#222222]">
        <!-- header -->
        <div class="flex justify-center items-center w-full h-[14%] py-4 border-b border-b-border_accent rounded-tl rounded-tr">
            <div class="flex flex-row justify-between w-[88.5%]">
                <p class="w-[89%] h-[40%] text-xl font-serif font-semibold">
                    {modalTitle}
                </p>

                <button
                    aria-label="Close menu"
                    onclick={() => (showModal = !showModal)}
                    class="cursor-pointer flex flex-row justify-center items-center w-8 h-8 rounded hover:bg-[#9198a1]/10"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        class="bi bi-x"
                        viewBox="0 0 16 16"
                    >
                        <path
                            d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"
                        />
                    </svg>
                </button>
            </div>
        </div>

        <!-- body -->
         <div class="flex justify-center items-center w-full py-4 rounded-tl rounded-tr">
            <div class="flex flex-col w-[87%] gap-2">
                {@render children()}
            </div>
        </div>
    </div>
</div>