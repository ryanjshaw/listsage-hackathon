export function toggleArrayElement<T>(array: T[], element: T, add: boolean): T[] {
    if (add) {
        if (!array.includes(element)) {
            return [...array, element];
        }
    } else {
        return array.filter(e => e !== element);
    }

    return array;
}