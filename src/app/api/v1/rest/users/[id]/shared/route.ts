import { db } from "@/data/connection";
import {
	collectionFolders,
	pinned,
	resourceCollections,
	resources,
	resourceShortUrlAccess,
} from "@/data/schema";
import { getSession } from "@/lib/auth";
import {
	findSharedUserResources,
	findUserResources,
} from "@/services/resource-service";
import { and, count, desc, eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
export const GET = async (req: NextRequest) => {
	const session = await getSession(req.headers);
	const user = session?.user;
	const searchParams = req.nextUrl.searchParams;
	const tab = searchParams.get("tab");

	if (!user)
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

	if (!user)
		return NextResponse.json(
			{ message: "Unauthorized", data: null },
			{ status: 401 },
		);

	const page = Number(searchParams.get("page")) || DEFAULT_PAGE;
	const limit = Number(searchParams.get("limit")) || DEFAULT_LIMIT;
	const search = searchParams.get("search") ?? "";
	const sortBy = searchParams.get("sort_by") ?? "created_at";
	const sortType = (searchParams.get("sort_type") ?? "descending") as
		| "ascending"
		| "descending"
		| null;

	// filters
	const categoryParams = searchParams.get("category");
	const tagsParams =
		searchParams
			.get("tags")
			?.split(",")
			.filter((tag) => tag) ?? [];

	try {
		if (tab === "collections") {
			const sharedCollections = await db
				.select({
					id: collectionFolders.id,
					name: collectionFolders.name,
					access_level: collectionFolders.access_level,
					resourceCount: sql<number>`CAST((${db.select({ count: count() }).from(resourceCollections).where(eq(resourceCollections.collection_folder_id, collectionFolders.id))}) AS integer)`,
					pinned: sql<boolean>`(CASE WHEN ${pinned.id} IS NOT NULL AND ${pinned.user_id} = ${user.id} THEN true ELSE false END)`.as(
						"pinned",
					),
					sharedBy:
						sql`(SELECT json_build_object('image', users.image, 'email', users.email) FROM users WHERE users.id = collection_folders.user_id LIMIT 1)`.as(
							"sharedBy",
						),
					userAccess:
						sql`(SELECT json_build_object('permission', (SELECT el->>'permission' FROM jsonb_array_elements(${collectionFolders.shared_to}) AS el WHERE el->>'email' = ${user.email} LIMIT 1)))`.as(
							"userAccess",
						),
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
				.where(
					sql`EXISTS (SELECT FROM jsonb_array_elements(${collectionFolders.shared_to}) AS shared WHERE (shared->>'email') = ${user.email})`,
				);

			return NextResponse.json(
				{
					message: "Successfully retrieved shared collections",
					data: { rows: sharedCollections },
				},
				{ status: 200 },
			); // OK
		} else if (tab === "resources") {
			const sharedResources = await db
				.select()
				.from(resourceShortUrlAccess)
				.where(
					sql`${resourceShortUrlAccess.emails} @> ARRAY[${user.email}]::text[]`,
				);
			if (!sharedResources.length)
				return NextResponse.json(
					{ message: "No resources", data: { rows: [], count: 0 } },
					{ status: 201 },
				);
			const { rows, totalCount } = await findSharedUserResources({
				limit: -1,
				page,
				search,
				sortBy,
				sortType,
				resourceIds: sharedResources.map(
					(resource) => resource.resource_id,
				),
				category: categoryParams,
				tags: tagsParams,
				userId: user?.id,
			});

			return NextResponse.json(
				{
					message: "Successfully retrieved shared collections",
					data: { rows, count: totalCount },
				},
				{ status: 200 },
			); // OK
		}
	} catch (err) {
		console.log(err);
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 },
		); // Internal Server Error
	}

	return NextResponse.json({ message: "Authorized" }, { status: 200 });
};
