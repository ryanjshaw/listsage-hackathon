<script lang="ts">
    import type { Link } from './ItemModel';
	import { onMount } from 'svelte';
	import { favsStore, doneStore } from './store';
	import { toggleArrayElement } from '$lib/helpers/array';

    export let link: Link;

    let favState: boolean;
    let doneState: boolean;
    let metadata: any = {};

    onMount(() => {
        favState = $favsStore.includes(link.id)
        doneState = $doneStore.includes(link.id)
    });

    function toggleFav(event: Event) {
        const target = event.target as HTMLInputElement;
		favsStore.update(oldFavs => toggleArrayElement(oldFavs, link.id, target.checked));
    }

    function toggleDone(event: Event) {
        const target = event.target as HTMLInputElement;
		doneStore.update(oldDone => toggleArrayElement(oldDone, link.id, target.checked));
    }

	async function fetchMetadata() {
		const response = await fetch(`/api/metadata?url=${encodeURIComponent(link.url)}`);
		metadata = await response.json();
	}

    fetchMetadata();
</script>

<div class="flex pl-2 pr-2 pt-1 pb-1 items-center">
    <input 
        type="checkbox" 
        class="form-checkbox rounded-full text-green-500"
        bind:checked={doneState}
        on:change={toggleDone}
    />
    <div class="pl-2 text-sm">
        <a href={link.url} target="_blank">{link.title}</a>
    </div>           
    <div class="ml-auto">
        <input
            type="checkbox"
            id="fav-{link.id}"
            class="fav"
            bind:checked={favState}
            on:change={toggleFav}             
        />
        <label for="fav-{link.id}">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon h-4 w-4" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
        </label>        
    </div>    
</div>
<div class="mx-8 mb-4 object-cover rounded-2xl overflow-hidden ring-1 ring-gray-200">
    <a href={link.url} target="_blank"><img src={metadata.image} alt="{metadata.title}" /></a>
</div>

<style>
	.fav {
		/* Hide the checkbox but still make it focusable for a11y */
		position: absolute;
        opacity: 0;
        cursor: pointer;
	}

    .fav + label .icon {
        fill: none;
        stroke: black;
        stroke-width: 1;
    }

    .fav:checked + label .icon {
        fill: red;
    }
</style>