import type { Readable, Subscriber } from 'svelte/store';

export function subscribeToUpdatesOnly<T>(store: Readable<T>, run: Subscriber<T>) {
    let initialRun = true;
    return store.subscribe(state => {
        if (initialRun) {
            initialRun = false;
        } else {
            run(state);
        }
    })
}