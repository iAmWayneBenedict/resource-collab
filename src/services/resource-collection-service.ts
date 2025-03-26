import { db } from "@/data/connection";
import { collectionFolders, resourceCollections } from "@/data/schema";
import { and, eq, inArray } from "drizzle-orm";

type CollectionResponse = {
	collectionFolder: typeof collectionFolders.$inferSelect | null;
	collection: typeof resourceCollections.$inferSelect | null;
};

export const addResourceToCollection = async (
	userId: string,
	resourceId: number,
	collectionFolderIds: number[],
): Promise<CollectionResponse> => {
	return db.transaction(async (tx) => {
		// Get existing collections for this resource and user
		const existingCollections = await tx
			.select()
			.from(resourceCollections)
			.where(
				and(
					eq(resourceCollections.user_id, userId),
					eq(resourceCollections.resource_id, resourceId),
				),
			);

		// Find collections to add and remove
		const existingIds = existingCollections.map(
			(c) => c.collection_folder_id,
		);
		const collectionsToAdd = collectionFolderIds.filter(
			(id) => !existingIds.includes(id),
		);
		const collectionsToRemove = existingIds.filter(
			(id) => !collectionFolderIds.includes(id),
		);

		// Only perform database operations if there are changes
		if (collectionsToRemove.length > 0) {
			await tx
				.delete(resourceCollections)
				.where(
					and(
						eq(resourceCollections.user_id, userId),
						eq(resourceCollections.resource_id, resourceId),
						inArray(
							resourceCollections.collection_folder_id,
							collectionsToRemove,
						),
					),
				);
		}

		if (collectionsToAdd.length > 0) {
			await tx.insert(resourceCollections).values(
				collectionsToAdd.map((id) => ({
					user_id: userId,
					collection_folder_id: id,
					resource_id: resourceId,
				})),
			);
		}

		// Return the updated collections
		const [updatedCollection] = await tx
			.select()
			.from(resourceCollections)
			.where(
				and(
					eq(resourceCollections.user_id, userId),
					eq(resourceCollections.resource_id, resourceId),
				),
			);

		return {
			collectionFolder: null,
			collection: updatedCollection || null,
		};
	});
};

export const createCollectionWithResource = async (
	userId: string,
	name: string,
	resourceId: number,
): Promise<CollectionResponse> => {
	return db.transaction(async (tx) => {
		const exist = await tx
			.select()
			.from(collectionFolders)
			.where(
				and(
					eq(collectionFolders.user_id, userId),
					eq(collectionFolders.name, name),
				),
			);

		if (exist.length) {
			throw new Error("Collection already exists");
		}

		const [newCollectionFolder] = await tx
			.insert(collectionFolders)
			.values({ name, user_id: userId })
			.returning();

		const [newCollection] = await tx
			.insert(resourceCollections)
			.values({
				user_id: userId,
				collection_folder_id: newCollectionFolder.id,
				resource_id: resourceId,
			})
			.returning();

		return {
			collectionFolder: newCollectionFolder,
			collection: newCollection,
		};
	});
};

export const createEmptyCollection = async (
	userId: string,
	name: string,
): Promise<CollectionResponse> => {
	return db.transaction(async (tx) => {
		const exist = await tx
			.select()
			.from(collectionFolders)
			.where(
				and(
					eq(collectionFolders.user_id, userId),
					eq(collectionFolders.name, name),
				),
			);

		if (exist.length) {
			throw new Error("Collection already exists");
		}
		const [newCollectionFolder] = await tx
			.insert(collectionFolders)
			.values({ name, user_id: userId })
			.returning();

		return { collectionFolder: newCollectionFolder, collection: null };
	});
};
