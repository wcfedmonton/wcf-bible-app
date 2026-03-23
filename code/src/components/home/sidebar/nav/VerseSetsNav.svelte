<script lang="ts">
	import NavItem from './NavItem.svelte';

	const { disabled } = $props();

	const menu = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="15" height="18" class="w-full">
            <line x1="15" y1="25" x2="85" y2="25" stroke="black" stroke-width="5" stroke-linecap="round" class="${!disabled ? 'stroke-form_title' : 'stroke-[#6b7074]'}"/>
            <line x1="15" y1="50" x2="85" y2="50" stroke="black" stroke-width="5" stroke-linecap="round" class="${!disabled ? 'stroke-form_title' : 'stroke-[#6b7074]'}"/>
            <line x1="15" y1="75" x2="85" y2="75" stroke="black" stroke-width="5" stroke-linecap="round" class="${!disabled ? 'stroke-form_title' : 'stroke-[#6b7074]'}"/>
        </svg>
    `;
</script>

<NavItem pageTitle="Verse Set Manager" icon={menu} {disabled} route="/verse-sets" />
