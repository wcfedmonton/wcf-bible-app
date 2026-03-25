<script lang="ts">
    import Modal from "./Modal.svelte";
    import Button from "./export/Button.svelte";

    let { showExportModal = $bindable() } = $props();
</script>

<Modal modalTitle="Export Verse Set" bind:showModal={showExportModal}>
   <div class="w-full">
        <p class="font-serif text-[0.8rem] text-light_grey">Exporting</p>
        <p class="font-serif font-semibold italic text-[1rem]">Sunday Service: Comfort & Hope</p>
   </div>

   <div class="flex flex-row w-full mt-1 gap-x-2">
        <Button title="Send by Email" subtitle="Send this set directly to another operator's email address" type="email" />
        <Button title="Download Locally" subtitle="Save a .json file to your device" type="download"/>
   </div>
</Modal>