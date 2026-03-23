<script lang="ts">
	let { prompt, endpoint, action } = $props();
</script>

<div class="text-center mt-6">
	{prompt}
	<a href={endpoint} class="text-input_focus hover:text-input_focus_hover">{action}</a>
</div>
