<script lang="ts">
	let { title, state = $bindable(), disabledCondition } = $props();
</script>

<button
	type="submit"
	disabled={disabledCondition(state)}
	class="w-full p-[0.7rem] cursor-pointer font-medium bg-accent_btn rounded-sm hover:bg-accent_btn_hover disabled:opacity-50 disabled:pointer-events-none"
	>{title}</button
>