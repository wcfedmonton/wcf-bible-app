<script lang="ts">
    import Modal from "./Modal.svelte";
    import Select from "./import/Select.svelte";
    import Selected from "./import/Selected.svelte";

    // import type { VerseSet } from "$lib/utils";

    let { showImportModal = $bindable() } = $props();

    let validFile = $state(true);
    let importedSet: object | null = $state(null); // the VerseSet type will be specified later, once behaviour for file processing is implemented
    let fileInput: HTMLInputElement | null = $state(null);   
    let selectedFile: File | null | undefined = $state(null); 

    function handleUpload(e: Event) {
        e.preventDefault(); // prevents a new tab from opening

        if(e instanceof DragEvent) {
            const file = e.dataTransfer?.files?.[0];
            
            selectedFile = file;
        } else {
            const file = fileInput?.files?.item(0);
            
            selectedFile = file;
        }

        // this is where the check will be done to ensure the file is valid. for now we set an
        // arbitrary value for testing
        validFile = true; // will be used to toggle error state
        importedSet =  { // will represent the actual set
            verses: [
                { verseReference: "Matthew 28:19", translation: "NIV" },
                { verseReference: "Romans 10:15", translation: "ESV" },
                { verseReference: "Acts 1:8", translation: "NKJV" },
                { verseReference: "Isaiah 6:8", translation: "NIV" },
                { verseReference: "Mark 16:15", translation: "ESV" },
                { verseReference: "Luke 24:47", translation: "NIV" }
            ]
        };
    }
</script>

<Modal modalTitle="Import Verse Set" bind:showModal={showImportModal}>
   {#if !selectedFile || !validFile} 
        <Select handleUpload={handleUpload} bind:selectedFile bind:fileInput bind:validFile />
    {:else}
        <Selected bind:importedSet bind:selectedFile />
    {/if}
</Modal>