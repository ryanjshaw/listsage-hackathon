export interface ItemType {
    id: number;
    type: string;
    title: string;
    description?: string;
}

export enum ItemTypeEnum {
    Section = 'Section',
    Link = 'Link'
}

export interface SectionItem extends ItemType {
    type: ItemTypeEnum.Section;
    items: Item[];
    description?: string;
    text?: string;
}

export interface LinkItem extends ItemType {
    type: ItemTypeEnum.Link;		
    links: Link[];
}

export interface Link {
    id: number;
    title: string;
    url: string;
}

export type Item = SectionItem | LinkItem;

export function isLinkItem(item: Item): item is LinkItem {
    return item.type === ItemTypeEnum.Link;
}

export function isSectionItem(item: Item): item is SectionItem {
    return item.type === ItemTypeEnum.Section;
}

export function countLinks(section: SectionItem) {
    return section.items
        .reduce((count, item) => isLinkItem(item) ? count + item.links.length : count, 0);
}

export function countDone(section: SectionItem, done: number[]) {
    return section.items
        .reduce((count, item) => {
            if (isLinkItem(item)) {
                // Count the number of done links within the item
                return count + item.links.filter(link => done.includes(link.id)).length;
            }
            return count;
        }, 0);
}

export function findSection(items: Item[], id: number): SectionItem | null {
    for (let item of items) {
        if (isSectionItem(item)) {
            if (item.id === id) {
                return item;
            }

            item.items
            let found = findSection(item.items, id);
            if (found) {
                return found;
            }
        }
    }

    return null;
}