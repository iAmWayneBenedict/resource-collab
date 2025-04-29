import { db } from "@/data/connection";
import {
	collectionFolders, pinned,
	resourceCollections,
	resources
} from "@/data/schema";
import { getSession } from "@/lib/auth";
import { count, desc, eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
	const session = await getSession(req.headers);
	const user = session?.user;
	if (!user) {
		return NextResponse.json(
			{ message: "Unauthorized", data: null },
			{ status: 401 },
		);
	}

	try {
		// ! THERE is a bug in the drizzle relational queries where subqueries with conditional queries are not working (at least for extras)
		const collectionsData = await db
			.select({
				id: collectionFolders.id,
				name: collectionFolders.name,
				access_level: collectionFolders.access_level,
				resourceCount: sql<number>`CAST((${db.select({ count: count() }).from(resourceCollections).where(eq(resourceCollections.collection_folder_id, collectionFolders.id))}) AS integer)`,
				pinned: sql<boolean>`(CASE WHEN ${pinned.id} IS NOT NULL THEN true ELSE false END)`.as("pinned"),
				thumbnail: sql`(${db
					.select({ thumbnail: resources.thumbnail })
					.from(resources)
					.where(
						eq(
							resources.id,
							db
								.select({
									resource_id:
										resourceCollections.resource_id,
								})
								.from(resourceCollections)
								.where(
									eq(
										resourceCollections.collection_folder_id,
										collectionFolders.id,
									),
								)
								.orderBy(desc(resourceCollections.id))
								.limit(1),
						),
					)
					.limit(1)})`.as("thumbnail"),
			})
			.from(collectionFolders)
			.leftJoin(pinned, eq(pinned.collection_id, collectionFolders.id))
			.where(eq(collectionFolders.user_id, user.id))
			.orderBy(desc(collectionFolders.id));

		return NextResponse.json(
			{
				message: "Successfully retrieved collections",
				data: { rows: collectionsData, count: collectionsData.length },
			},
			{ status: 200 },
		);
	} catch (error) {
		console.log(error);

		return NextResponse.json(
			{ message: "Something went wrong", data: null },
			{ status: 500 },
		);
	}
};
