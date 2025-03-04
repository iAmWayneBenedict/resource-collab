import { db } from "@/data/connection";
import { collectionFolders, resourceCollections } from "@/data/schema";

type CreateResourceCollectionDto = {
	name: string;
	userId: string;
	resourceId?: number;
	portfolioId?: number;
};

type CollectionResponse = {
	newCollectionFolder: typeof collectionFolders.$inferSelect;
	newCollection: typeof resourceCollections.$inferSelect;
};

export const createResourceCollection = async (
	body: CreateResourceCollectionDto,
): Promise<CollectionResponse> => {
	return db.transaction(async (tx) => {
		const [newCollectionFolder] = await tx
			.insert(collectionFolders)
			.values({ name: body.name, user_id: body.userId })
			.returning();

		const [newCollection] = await tx
			.insert(resourceCollections)
			.values({
				user_id: body.userId,
				collection_folder_id: newCollectionFolder.id,
				resource_id: body.resourceId,
			})
			.returning();

		return { newCollectionFolder, newCollection };
	});
};
