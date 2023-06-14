<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    
	import type { SectionItem } from './ItemModel';
	import { isLinkItem } from './ItemModel';
    import LinkRow from './LinkRow.svelte';
	import type { List } from '$lib/AppwriteService';

    export let list: List;
    export let iconUrl: string;
    export let section: SectionItem;
</script>

<div class="flex pl-2 pt-1 pb-1 bg-pink-500 items-center">    
    <button class="text-white text-2xl" on:click={() => dispatch('back')}>🡄</button>
    <div class="ml-2 h-8 w-8 overflow-hidden rounded-full" >
        <img src={iconUrl} alt="List icon" />
    </div>
    <div class="ml-2 text-white font-medium">
        {list.title}
    </div>
    <div class="ml-auto mr-1 text-white">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
            <circle cx="12" cy="12" r="1"></circle>
            <circle cx="12" cy="5" r="1"></circle>
            <circle cx="12" cy="19" r="1"></circle>
        </svg>
    </div>
</div>

<div class="p-2">
    {section.title}
</div>

<hr class="border-pink-200"/>

{#each section.items as item (item.id)}
    {#if isLinkItem(item) }
        {#if item.title}
            <div class="px-2 pt-2 text-sm font-medium">
                {item.title}
            </div>          
        {/if}  
        {#if item.description}
            <div class="px-2 text-sm text-gray-800">
                {item.description}
            </div>
        {/if}
        {#each item.links as link (link.id)}
            <LinkRow link={link} />
        {/each}
    {/if}
    <hr class="border-pink-200"/>
{/each}