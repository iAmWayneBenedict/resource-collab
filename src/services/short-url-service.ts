import { collectionFolders, resourceShortUrlAccess } from "@/data/schema";
import { eq } from "drizzle-orm";
import { PgTransaction } from "drizzle-orm/pg-core";
import { PostgresJsQueryResultHKT } from "drizzle-orm/postgres-js";

export const uniqueSharedEmails = async (
	userId: string,
	transactionContext: PgTransaction<PostgresJsQueryResultHKT, any, any>,
) => {
	try {
		return await transactionContext.transaction(async (tx) => {
			const sharedCollectionEmails = await tx
				.select()
				.from(collectionFolders)
				.where(eq(collectionFolders.user_id, userId));
			const sharedResourceEmails = await tx
				.select()
				.from(resourceShortUrlAccess)
				.where(eq(resourceShortUrlAccess.user_id, userId));
			const extractSharedCollectionEmails = sharedCollectionEmails
				.map((item) => {
					const sharedTo = item.shared_to as Array<{ email: string }>;
					return sharedTo.map(({ email }) => email);
				})
				.flat();
			const extractSharedResourceEmails = sharedResourceEmails.map(
				({ emails }) => emails,
			);
			const tempCombined = [
				...extractSharedCollectionEmails,
				...extractSharedResourceEmails,
			];
			return [...new Set(tempCombined)];
		});
	} catch (error) {
		console.log(error);
		return [];
	}
};
