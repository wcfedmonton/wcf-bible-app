<script lang="ts">
    import Modal from "./Modal.svelte";

    import { getDate } from "$lib/utils";
    import Select from "./import/Select.svelte";
    import Selected from "./import/Selected.svelte";
    import { fetchVerse } from "$lib/bible/chapterServices";

    let { showImportModal = $bindable() } = $props();

    let validFile = $state(true);
    let importedSet: object | null = $state(null); // the VerseSet type will be specified later, once behaviour for file processing is implemented
    let fileInput: HTMLInputElement | null = $state(null);   
    let selectedFile: File | null | undefined = $state(null); 

    async function readFile() {
        type ImportedSet = {
            name: string,
            verses: {
                orderId: number,
                translation: string,
                verseReference: string
            }[]
        }

        const verseSetId = crypto.randomUUID();
        const content: ImportedSet = await JSON.parse(await selectedFile!.text());
        const versePromises = content.verses.map(async (verse) => {
            const { text } = await fetchVerse(verse.verseReference, verse.translation);

            return { 
                text,
                ...verse,
                verseSetId
            };
        });

        return {
            id: verseSetId,
            name: content.name,
            lastEdited: getDate(),

            verses: await Promise.all(versePromises)
        };
    }

    async function handleUpload(e: Event) {
        e.preventDefault(); // prevents a new tab from opening

        if(e instanceof DragEvent) {
            const file = e.dataTransfer?.files?.[0];
            
            selectedFile = file;
        } else {
            const file = fileInput?.files?.item(0);
            
            selectedFile = file;
        }
        
        validFile = true; // will be used to toggle error state
        importedSet = await readFile(); // if there is any errors during processing, a null value should be returned, then we set 'validFile' accordingly
   }
</script>

<Modal modalTitle="Import Verse Set" bind:showModal={showImportModal}>
   {#if !selectedFile || !validFile} 
        <Select handleUpload={handleUpload} bind:selectedFile bind:fileInput bind:validFile />
    {:else}
        <Selected bind:importedSet bind:selectedFile bind:showImportModal />
    {/if}
</Modal>