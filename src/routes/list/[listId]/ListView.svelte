<script lang="ts">
	import { createEventDispatcher } from "svelte";
    const dispatch = createEventDispatcher();
    
    import { statusStore } from './store';
	import { type List, SubscriptionStatus } from "$lib/AppwriteService";
	import { ItemTypeEnum, type Item } from './ItemModel';
    import SectionRow from "./SectionRow.svelte";

    export let list: List;
    export let items: Item[];
    export let bannerUrl: string;

    console.log(bannerUrl);
</script>

<div class="object-cover">
    <img src={bannerUrl} alt="List banner" />
</div>

<div class="flex px-2 py-2">
    <div>
        {list.title} by <a href={list.source} class="text-pink-600">@{list.author}</a>
    </div>
    {#if $statusStore == SubscriptionStatus.Inactive }
        <button on:click={() => dispatch('subscribe')}
            class="ml-auto pl-2 pr-2 mr-2 text-white ring-1 ring-pink-400 rounded-md bg-pink-500 hover:bg-pink-400">
            Subscribe
        </button>
    {:else if $statusStore == SubscriptionStatus.Active }
        <button on:click={() => dispatch('unsubscribe')}
            class="ml-auto pl-2 pr-2 mr-2 text-sm text-gray-600 ring-1 ring-gray-200 rounded-md bg-gray-100 hover:bg-gray-200">
            Unsubscribe
        </button>
    {/if}
</div>

<div class="px-2 pb-2 text-sm text-gray-900">
    {list.description}
</div>

{#each items as item (item.id)}
    {#if item.type === ItemTypeEnum.Section }
        <hr class="border-pink-200" />
        <SectionRow section={item} depth={0} on:sectionclick />
    {/if}
{/each}