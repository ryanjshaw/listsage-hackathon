<script lang="ts">
	import { AppwriteService, type CurrentListVersion } from "$lib/AppwriteService";
	import { onMount } from "svelte";

    let lists: CurrentListVersion[];
    onMount(async () => {
        lists = await AppwriteService.browseLists(1, 10);
    });
</script>


<div class="flex justify-between bg-slate-50">
    {#if lists}
        {#each lists as list (list.$id)}            
            <div class="m-4 shadow-md drop-shadow-md rounded-lg overflow-hidden bg-white">
                <a href="/list/{list.$id}">
                    <img src={list.bannerUrl.toString()} alt="List banner" />
                    <div class="p-2">
                        {list.title} by <a href={list.source} class="text-pink-600">@{list.author}</a>
                    </div>
                    <div class="p-2 text-sm text-gray-900">
                        {list.description}
                    </div>
                </a>
            </div>
        {/each}
    {/if}
</div>