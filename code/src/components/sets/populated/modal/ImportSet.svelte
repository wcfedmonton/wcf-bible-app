<script lang="ts">
    import Modal from "./Modal.svelte";

    let fileInput: HTMLInputElement;

    function handleDrop(e: DragEvent) {
        e.preventDefault();

        const files = e.dataTransfer?.files;
        console.log(files?.item(0)) // investigate why this value is null
    }
</script>

<Modal modalTitle="Import Set">
    <div class="flex justify-center items-center w-full py-4 rounded-tl rounded-tr">
        <div class="flex flex-col w-[87%] gap-2">
            <p class="w-full h-5 font-sans text-[#f0e6e6] text-[0.87rem]">
                Upload a <span class="w-[3rem] h-6 bg-zinc-800 text-center text-[0.81rem] inline-block border border-border_accent rounded-sm">.json</span> file exported from the WCF Bible App.
            </p>

            <div
                tabindex={1}
                role="button"
                ondrop={handleDrop}
                ondragover={(e) => e.preventDefault()} 
                class="relative w-full h-48 my-4 border-2 border-dashed border border-light_grey hover:border-accent rounded"
            >
                <input bind:this={fileInput} type="file" accept=".json" class="absolute inset-0 w-full h-full opacity-0 z-10 pointer-events-none"/>
                
                <div class="absolute inset-0 z-0 flex flex-col items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-plus-lg text-[#e0e0e0] mb-4" viewBox="0 0 16 16">
                        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"/>
                        <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"/>
                    </svg>
                    
                    <p class="font-serif text-[0.95rem]">Drop your file here</p>
                    <p class="text-light_grey">or</p>
                    <button
                        onclick={() => fileInput.click()}
                        class="cursor-pointer relative z-20 flex flex-row justify-center p-[0.3rem] w-[6rem] mt-2 gap-[0.3rem] border-solid border-1 rounded-[0.2rem] border-action_btn_border bg-[#d3413f2e] hover:bg-[#d3413f50]"
                    >
                        <p class="text-[90%] text-[#e0e0e0]">Browse...</p>
                    </button>
                </div>
            </div>

            <div class="flex mt-auto justify-end items-end w-full">
                <button class="cursor-pointer w-30 h-10 rounded font-sans font-semibold bg-accent_btn hover:bg-accent_btn_hover">
                    Import Set
                </button>
            </div>
        </div>
    </div>
</Modal>