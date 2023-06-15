<script lang="ts">
	import { AppwriteService } from "$lib/AppwriteService";
	import { createEventDispatcher } from "svelte";
	import { fade } from "svelte/transition";

    export let listTitle: string;
    export let iconUrl: string;
    export let redirectParameters: string;
    
    const dispatch = createEventDispatcher();

	let email = '';

	let sent = false;
	async function subscribe() {
		const url = `${window.location.origin}/magic${redirectParameters}`;
		await AppwriteService.createMagicURLSession(email, url);
		sent = true;
	}
</script>

<div class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" transition:fade={{duration: 200}}></div>

    <div class="fixed inset-0 z-10 overflow-y-auto">
    <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center" transition:fade={{duration: 200}}>			
        <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all">
            {#if !sent}
                <div class="bg-white mx-auto px-4 pb-4 pt-5">
                    <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-full">
                        <img src={iconUrl} alt="List Icon" />
                    </div>
                    <div class="mt-3 text-center">
                        <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">{listTitle}</h3>
                        <div class="mt-2">
                        <p class="text-sm text-gray-500">Appwrite is a backend-as-a-service platform that provides developers with all the core APIs required to build any application.</p>
                        </div>
                    </div>
                </div>
                <div class="px-4 py-3 w-full flex justify-center">
                    <input type="email" placeholder="Email Address" bind:value={email} class="py-2 px-6 w-2/3 rounded-l-md border border-gray-400">
                    <button type="button" class="py-2 px-6 rounded-r-md text-white bg-pink-600 hover:bg-pink-500" on:click={subscribe}>Subscribe</button>					
                </div>
                <button type="button" class="px-3 py-2 text-sm text-gray-700 text-center w-full" on:click={() => dispatch('closed') }>&lt; Go back</button>
            {:else}
                <div class="bg-white mx-auto px-4 pb-4 pt-5">
                    <div>An email has been sent to <code>{email}</code></div>
                    <div class="font-medium">Check your email to continue!</div>
                </div>
            {/if}
        </div>
    </div>
    </div>
</div>