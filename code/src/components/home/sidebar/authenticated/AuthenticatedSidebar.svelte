<script lang="ts">
    import Name from "../Name.svelte";
    import Title from "../Title.svelte";
    import Header from "../Header.svelte";
    import Sets from "../sets/Sets.svelte";
    import SignOut from "./SignOut.svelte";
    import Divider from "../Divider.svelte";
    import VerseSetsNav from "../nav/VerseSetsNav.svelte";

    import { fly } from "svelte/transition";
    import { cubicOut } from "svelte/easing";

    let { showSidebar = $bindable() } = $props();
</script>

<div 
    transition:fly={{ x: -100, duration: 300, easing: cubicOut }}
    class="w-[19%] min-w-[18rem] h-dvh flex flex-col border border-solid border-border_accent bg-[#1a1a1a] shadow-[4px_0_28px_rgba(0,0,0,0.6)]"
>
    <Header bind:showSidebar={showSidebar} />

    <Name />

    <Title title="NAVIGATION"/>
    <VerseSetsNav disabled={false}/>
    <Divider />

    <Title title="VERSE SETS" />
    <Sets />
    
    <SignOut />
</div>