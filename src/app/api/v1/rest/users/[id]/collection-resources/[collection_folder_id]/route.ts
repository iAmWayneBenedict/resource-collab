import { db } from "@/data/connection";
import { collectionFolders, resourceCollections } from "@/data/schema";
import { getSession } from "@/lib/auth";
import { findResources } from "@/services/resource-service";
import { and, count, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
	req: NextRequest,
	{ params }: { params: Promise<{ collection_folder_id: string }> },
) => {
	const { collection_folder_id } = await params;
	const searchParams = req.nextUrl.searchParams;

	const session = await getSession(req.headers);
	const user = session?.user;

	if (!user) {
		return new Response("Unauthorized", { status: 401 });
	}

	if (!collection_folder_id) {
		return new Response("Bad Request", { status: 400 });
	}

	try {
		const exist = await db
			.select()
			.from(collectionFolders)
			.where(
				and(
					eq(collectionFolders.user_id, user?.id),
					eq(collectionFolders.id, collection_folder_id),
				),
			);
		if (!exist.length) {
			return NextResponse.json(
				{
					message: "Collection not found",
					data: { rows: [], totalCount: 0 },
				},
				{ status: 200 },
			);
		}
		const [resourceIds, totalCount] = await db.transaction(async (tx) => {
			const [{ totalCount }] = await tx
				.select({ totalCount: count() })
				.from(resourceCollections)
				.where(
					and(
						eq(resourceCollections.user_id, user?.id),
						eq(
							resourceCollections.collection_folder_id,
							collection_folder_id,
						),
					),
				);
			const resourceIds = await tx
				.select({ resource_id: resourceCollections.resource_id })
				.from(resourceCollections)
				.where(
					and(
						eq(resourceCollections.user_id, user?.id),
						eq(
							resourceCollections.collection_folder_id,
							collection_folder_id,
						),
					),
				);

			return [resourceIds, totalCount];
		});

		if (!resourceIds.length) {
			return NextResponse.json(
				{
					message: "No resources found",
					data: { rows: [], totalCount: 0 },
				},
				{ status: 200 },
			);
		}

		const ids: number[] = resourceIds
			.map(({ resource_id }) => resource_id as number)
			.filter((id): id is number => id !== null);

		try {
			const page = Number(searchParams.get("page")) || 1;
			const limit = Number(searchParams.get("limit")) || 10;
			const search = searchParams.get("search") ?? "";
			const sortBy = searchParams.get("sort_by") ?? "";
			const sortType = searchParams.get("sort_type") as
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

			const { rows } = await findResources({
				limit,
				page,
				search,
				sortBy,
				sortType,
				resourceIds: ids,
				category: categoryParams,
				tags: tagsParams,
				userId: user?.id,
			});

			return NextResponse.json(
				{
					message: "Success",
					data: { rows, count: totalCount, collection: exist[0] },
				},
				{ status: 200 },
			);
		} catch (err) {
			console.log(err);
		}
	} catch (err) {
		console.log(err);
	}
};
