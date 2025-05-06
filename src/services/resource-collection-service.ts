import { db } from "@/data/connection";
import { collectionFolders, pinned, resourceCollections } from "@/data/schema";
import { and, eq, inArray } from "drizzle-orm";
import { updateSubscriptionCountLimit } from "./subscription-service";

type CollectionResponse = {
	collectionFolder: typeof collectionFolders.$inferSelect | null;
	collection: typeof resourceCollections.$inferSelect | null;
};

export const addResourceToCollection = async (
	userId: string,
	resourceId: number,
	collectionFolderIds: string[],
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
		await updateSubscriptionCountLimit({
			userId: userId,
			limitCountName: "collections",
			mode: "increment",
			tx,
		});

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

		await updateSubscriptionCountLimit({
			userId: userId,
			limitCountName: "collections",
			mode: "increment",
			tx,
		});

		return { collectionFolder: newCollectionFolder, collection: null };
	});
};

export const findAllPinnedCollections = async (body: Record<string, any>) => {
	const collections = await db.query.pinned.findMany({
		with: {
			collectionFolders: {
				with: {
					resourceCollections: {
						with: {
							resource: {
								columns: {
									created_at: false,
								},
								with: {
									category: { columns: { name: true } },
									likes: { columns: { liked_at: true } },
									tags: {
										columns: {
											resource_id: false,
											tag_id: false,
										},
										with: {
											tag: { columns: { name: true } },
										},
									},
								},
							},
						},
					},
				},
			},
		},
		where: eq(pinned.user_id, body.id),
	});
	return collections
		?.map((collection: any) => {
			collection.collectionFolders.thumbnail =
				collection.collectionFolders.resourceCollections?.at(-1)
					?.resource.thumbnail || "";
			collection.collectionFolders.resourceCount =
				collection.collectionFolders.resourceCollections?.length;

			return collection;
		})
		.map((collection: any) => {
			const { resourceCollections, ...rest } =
				collection.collectionFolders;
			return {
				...rest,
				resources:
					collection.collectionFolders.resourceCollections?.map(
						(collection: any) => {
							const {
								likes,
								tags: defaultTags,
								...rest
							} = collection.resource;
							const likesCount = collection.resource.likes.length;
							const tags = defaultTags.map(
								({ tag }: { tag: Record<string, string> }) =>
									tag.name,
							);
							return {
								...rest,
								tags,
								likesCount,
							};
						},
					),
			};
		})
		.flat();
};
