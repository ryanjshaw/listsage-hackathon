import { writable } from 'svelte/store';
import type { Models } from 'appwrite';

export const authStore = writable<Models.User<Models.Preferences> | null | undefined>(undefined);