<script lang="ts">
	import Title from "./Title.svelte";

    const { title } = $props();
</script>

<div class="mb-5">
    <Title {title}/>
    <input type="text" name={title} class="w-full bg-form_input border border-input_border border-solid rounded py-2 px-4 hover:border-input_focus focus:outline-none focus:ring-0 focus:input-focus"/>
</div>