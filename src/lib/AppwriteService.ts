import { Account, Client, Databases, Functions, ID, Query, Storage, type Models, Permission, Role, Graphql } from 'appwrite';

const client = new Client()
	.setEndpoint('http://cloud.appwrite.io/v1')
	.setProject('646d183b2ce54b22f552');

const databases = new Databases(client);
const storage = new Storage(client);
const account = new Account(client);
const functions = new Functions(client);
const graphql = new Graphql(client);

const DEFAULT_DB = 'default';
const LIST_STATES_COLLECTION = 'listStates';
const LISTS_COLLECTION = 'lists';
const LIST_VERSIONS_COLLECTION = 'listVersions';

const LIST_ICONS_BUCKET = 'list-icons';
const LIST_BANNERS_BUCKET = 'list-banners';

export type List = {
    userId: string;
	title: string;
    author: string;
    source: string;
	description: string;
	currentVersionId: string;
} & Models.Document;

export type ListVersion = {
	listId: string;
	items: string;
	iconFileId: string;
	bannerFileId: string;
} & Models.Document;

export type CurrentListVersion = {
	iconUrl: URL;
	bannerUrl: URL;
} & List;

export enum SubscriptionStatus {
	Inactive = 'Inactive',
	Active = 'Active'
};

export type Subscription = {
	listId: string;
	userId: string;
	status: SubscriptionStatus;
	favs: number[];
	done: number[];
} & Models.Document;

export const AppwriteService = {
	////////////////////////
	// Accounts
	////////////////////////

	getAccount: async () => {
		try {
			return await account.get();
		} catch (e) {
			console.error(e);
			return null;
		}
	},

	createMagicURLSession: async(email: string, url: string) => {
		await account.createMagicURLSession(ID.unique(), email, url);
	},

	updateMagicURLSession: async(userId: string, secret: string) => {
		await account.updateMagicURLSession(userId, secret);
	},

	////////////////////////
	// Lists
	////////////////////////

	getCurrentListVersion: async(listId: string) => {
		try {
			const list = await databases.getDocument<List>(DEFAULT_DB, LISTS_COLLECTION, listId);
			if (!list.currentVersionId)
				return null;
				
			const listVersion =  await AppwriteService.getListVersion(list.currentVersionId);
			return { list, listVersion };
		} catch (e) {
			console.error(e)
			return null;
		}
	},

	getListVersion: async(listVersionId: string) => {
		return await databases.getDocument<ListVersion>(DEFAULT_DB, LIST_VERSIONS_COLLECTION, listVersionId);;
	},

	getListBannerUrl: async(fileId: string) => {
		return await storage.getFileView(LIST_BANNERS_BUCKET, fileId);
	},

	getListIconUrl: async(fileId: string) => {
		return await storage.getFileView(LIST_ICONS_BUCKET, fileId);
	},

	browseLists: async(pageNo: number, pageSize: number) => {
		const lists = await databases.listDocuments<List>(DEFAULT_DB, LISTS_COLLECTION, [
			Query.limit(pageSize),
			Query.offset((pageNo - 1) * pageSize)
		]);

		// Extract currentVersionIds from the page data
		const listVersionsPromises = lists.documents.map(async list => {
			const listVersion =  await AppwriteService.getListVersion(list.currentVersionId);
			const iconUrl = await AppwriteService.getListIconUrl(listVersion.iconFileId);
			const bannerUrl = await AppwriteService.getListBannerUrl(listVersion.bannerFileId);
			return { iconUrl, bannerUrl };
		});

		const listVersions = await Promise.all(listVersionsPromises);

		const currentListVersions: CurrentListVersion[] = lists.documents.map((list, index) => {
			return {
				...list,
				iconUrl: listVersions[index].iconUrl,
				bannerUrl: listVersions[index].bannerUrl
			};
		});
	
		return currentListVersions;
	},

	////////////////////////
	// List States
	////////////////////////

	lookupListState: async (listId: string, userId: string) => {
		const results = await databases.listDocuments<Subscription>(DEFAULT_DB, LIST_STATES_COLLECTION, [
			Query.equal('listId', listId),
			Query.equal('userId', userId),
			Query.limit(1)
		]);

		return results.total == 1 ? results.documents[0] : null;
	},

	createListState: async (listId: string, userId: string) => {
		return await databases.createDocument<Subscription>(DEFAULT_DB, LIST_STATES_COLLECTION, ID.unique(), {
			listId,
			userId,
			favs: [],
			done: []
		}, [
			Permission.read(Role.user(userId)),
			Permission.update(Role.user(userId))
		]);
	},

	updateFavs: async (subscriptionId: string, favs: number[]) => {
		return await databases.updateDocument<Subscription>(DEFAULT_DB, LIST_STATES_COLLECTION, subscriptionId, {
			favs
		});
	},

	updateDone: async (subscriptionId: string, done: number[]) => {
		return await databases.updateDocument<Subscription>(DEFAULT_DB, LIST_STATES_COLLECTION, subscriptionId, {
			done
		});
	},

	updateSubscription: async(subscriptionId: string, status: SubscriptionStatus) => {
		await databases.updateDocument<Subscription>(DEFAULT_DB, LIST_STATES_COLLECTION, subscriptionId, {
			status
		});
	}
};