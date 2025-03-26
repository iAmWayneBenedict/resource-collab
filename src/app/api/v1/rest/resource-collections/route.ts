import { db } from "@/data/connection";
import {
	collectionFolders,
	resourceCollections,
	resources,
} from "@/data/schema";
import { getSession } from "@/lib/auth";
import { asc, count, desc, eq, inArray, sql } from "drizzle-orm";
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
			.where(eq(collectionFolders.user_id, user.id))
			.orderBy(desc(collectionFolders.id));

		return NextResponse.json(
			{
				message: "Successfully retrieved collections",
				data: collectionsData,
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

export const DELETE = async (req: NextRequest) => {
	const session = await getSession(req.headers);
	const user = session?.user;

	if (!user)
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

	const body = await req.json();

	if (!body?.ids || !body?.ids.length) {
		return NextResponse.json({ message: "Bad Request" }, { status: 400 });
	}

	try {
		await db
			.delete(collectionFolders)
			.where(inArray(collectionFolders.id, body.ids));
		return NextResponse.json(
			{ message: "Successfully deleted collections" },
			{ status: 200 },
		);
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{ message: "Something went wrong" },
			{ status: 500 },
		);
	}
};
