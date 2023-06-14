<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

	import { countDone, countLinks, type SectionItem } from './ItemModel';
	import { ItemTypeEnum } from './ItemModel';
    import { doneStore } from './store';

    export let section: SectionItem;
    export let depth: number;

    const adjustment = depth > 0 ? '' : 'font-medium';    
    
    const linkCount = countLinks(section);    
    const hasContent = linkCount > 0;

    let doneCount = 0;
    doneStore.subscribe(done => {
        doneCount = countDone(section, done);
    })
</script>

<div class="flex my-2 mx-1 px-1 items-center rounded-md hover:bg-pink-100">
    <button style="margin-left: {depth * 0.5}rem" class="block text-left text-sm {adjustment}"
        on:click={() => dispatch('sectionclick', section)}
        disabled={!hasContent}>
        {section.title}
    </button>
    {#if hasContent}
        {#if doneCount == linkCount}
            <div class="ml-auto mr-1 text-sm text-gray-600 font-light">
                <svg class="inline text-green-600 stroke-current" xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/>
                </svg>
                {linkCount}
            </div>
        {:else}
            <div class="ml-auto mr-1 text-sm text-gray-600 font-light">
                {doneCount} / {linkCount}
            </div>
        {/if}
    {/if}
</div>

{#each section.items as item (item.id)}
    {#if item.type === ItemTypeEnum.Section }
        <svelte:self section={item} depth={depth + 1} on:sectionclick />
    {/if}
{/each}