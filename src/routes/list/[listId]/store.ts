import { SubscriptionStatus } from '$lib/AppwriteService';
import { writable } from 'svelte/store';

export const favsStore = writable<number[]>([]);
export const doneStore = writable<number[]>([]);
export const statusStore = writable<SubscriptionStatus>(SubscriptionStatus.Inactive);