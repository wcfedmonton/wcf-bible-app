<script lang="ts">
    import Modal from "./Modal.svelte";
    import Select from "./import/Select.svelte";

    let { showImportModal = $bindable() } = $props();
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
    }
</script>

<Modal modalTitle="Import Verse Set" bind:showModal={showImportModal}>
   {#if !selectedFile} 
        <Select handleUpload={handleUpload} bind:fileInput />
    {:else}

    {/if}
</Modal>