<script lang="ts">
	const { form, children } = $props();
</script>

<form use:form>
	<div class="flex items-center">
		{@render children()}
	</div>
</form>
