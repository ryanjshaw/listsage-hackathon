<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import { AppwriteService, SubscriptionStatus, type List, type ListVersion } from '$lib/AppwriteService';
	import { authStore } from '$lib/stores/authStore';
	import { page } from '$app/stores';

	import SubscribeModal from '$lib/components/SubscribeModal.svelte';
	import { findSection, type Item, type SectionItem } from './ItemModel';	
	import SectionView from './SectionView.svelte';
	import ListView from './ListView.svelte';

	import { favsStore, doneStore, statusStore } from './store';
	import type { Unsubscriber } from 'svelte/store';
	import { subscribeToUpdatesOnly } from '$lib/helpers/stores';

	let list: List;
	let listVersion: ListVersion;
	let items: Item[];
	let iconUrl: URL;
	let bannerUrl: URL;
	let loaded: boolean = false;
	
	let selectedSection: SectionItem | null;
	let listStateId: string | null;
	let showingSubscribeModal: boolean;

	let storeSubscriptions: Unsubscriber[] = [];

	onMount(async () => {
		const listId = $page.params.listId;
	 	const result = await AppwriteService.getCurrentListVersion(listId);
		if (!result) {
			window.location.href = window.location.origin;
			return;
		}

		list = result.list;
		listVersion = result.listVersion;
		items = JSON.parse(result.listVersion.items) as Item[];
		iconUrl = await AppwriteService.getListIconUrl(listVersion.iconFileId);
		bannerUrl = await AppwriteService.getListBannerUrl(listVersion.bannerFileId);
		loaded = true;
		console.log("List loaded", list);

		// We allow specifying a sectionId to view, so that magic link logins take
		// users back to where they left off (roughly -- scrolling to a specific
		// linkId would be even better!)
        const sectionId = Number($page.url.searchParams.get('sectionId'));
		if (sectionId) {
			selectedSection = findSection(list.items, sectionId);
		}

		// If the user is logged in & has an existing subscription to the list, load the state
		$authStore = await AppwriteService.getAccount();
		if ($authStore) {
			const listState = await AppwriteService.lookupListState(list.$id, $authStore.$id);
			if (listState) {
				listStateId = listState.$id;
				favsStore.set(listState.favs);
				doneStore.set(listState.done);
				statusStore.set(listState.status);
				console.debug(`ListState ${listState.$id} loaded`);
			} else {
				console.debug("No ListState available");
			}
		} else {
			console.debug("Unauthenticated - won't load ListState");
		}

		// React to changes in the favs/done state
		storeSubscriptions.push(
			subscribeToUpdatesOnly(favsStore, async (newFavs) => {
				await ensureListState();
				await AppwriteService.updateFavs(listStateId!, newFavs);
				console.log("Updated subscription favs");
			}),
			subscribeToUpdatesOnly(doneStore, async (newDone) => {
				await ensureListState();
				await AppwriteService.updateDone(listStateId!, newDone);
				console.log("Updated subscription done");
			}),
			subscribeToUpdatesOnly(statusStore, async (newStatus) => {
				await ensureListState();
				await AppwriteService.updateSubscription(listStateId!, newStatus);
				console.log(`Updated subscription status to ${newStatus}`);
			})
		);
	});
	
	onDestroy(() => {
		storeSubscriptions.forEach(unsubscribe => unsubscribe());
	});

	async function ensureListState() {
		if (!$authStore) {
			console.debug(`Unauthenticated - need account`);
			showingSubscribeModal = true;
			return false;
		}

		if (!listStateId) {
			const listState = await AppwriteService.createListState(list.$id, $authStore.$id);
			listStateId = listState.$id;
			console.log(`Created ListState ${listStateId} for List ${list.$id}`);
		}
		else {
			console.debug(`ListState is ${listStateId}`);
		}

		return true;
	}
</script>

{#if showingSubscribeModal }	
	<SubscribeModal 
		listTitle={list.title}
		redirectParameters={`?listId=${list.id}&sectionId=${selectedSection?.id}`} 
		on:closed={() => showingSubscribeModal = false }
	/>
{:else if selectedSection}
	<SectionView
		list={list}
		iconUrl={iconUrl.toString()}
		section={selectedSection}
		on:back={() => selectedSection = null }
	/>
{:else if loaded}
	<ListView
		list={list}
		items={items}
		bannerUrl={bannerUrl.toString()}
		on:subscribe={ () => statusStore.set(SubscriptionStatus.Active) }
		on:unsubscribe={ () => statusStore.set(SubscriptionStatus.Inactive) }
		on:sectionclick={ ({ detail: section }) => selectedSection = section }
	/>
{:else}
	<div class="flex w-full h-screen items-center justify-center">
		<div
		class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
		role="status">
			<span
				class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
				>Loading...</span
			>
		</div>
	</div>
{/if}