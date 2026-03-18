<script lang="ts">
    import Name from "./Name.svelte";
    import Title from "./Title.svelte";
    import Header from "./Header.svelte";
    import Sets from "./sets/Sets.svelte";
    import NavItem from "./NavItem.svelte";
    import Divider from "./Divider.svelte";
    import SignOut from "./SignOut.svelte";

    const menu = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="15" height="18" class="w-full">
            <line x1="15" y1="25" x2="85" y2="25" stroke="black" stroke-width="5" stroke-linecap="round" class="stroke-form_title"/>
            <line x1="15" y1="50" x2="85" y2="50" stroke="black" stroke-width="5" stroke-linecap="round" class="stroke-form_title"/>
            <line x1="15" y1="75" x2="85" y2="75" stroke="black" stroke-width="5" stroke-linecap="round" class="stroke-form_title"/>
        </svg>
    `;
</script>

<div class="w-[19%] min-w-[18rem] h-dvh flex flex-col border border-solid border-border_accent bg-[#1a1a1a] shadow-[4px_0_28px_rgba(0,0,0,0.6)]">
    <Header />

    <Name />

    <Title title="NAVIGATION"/>
    <NavItem pageTitle="Verse Set Manager" icon={menu}/>
    <Divider />

    <Title title="VERSE SETS" />
    <Sets />
    
    <SignOut />
</div>