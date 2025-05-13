import { db } from "@/data/connection";
import {
	collectionFolders,
	pinned,
	resourceCollections,
	resources,
} from "@/data/schema";
import { getSession } from "@/lib/auth";
import { findResources } from "@/services/resource-service";
import { and, count, desc, eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
	req: NextRequest,
	{ params }: { params: Promise<{ collection_folder_id: number | string }> },
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
			.where(eq(collectionFolders.id, collection_folder_id as string));
		if (!exist.length) {
			return NextResponse.json(
				{
					message: "Collection not found",
					data: { rows: [], totalCount: 0 },
				},
				{ status: 404 },
			);
		}
		const [sharedCollections, totalCount] = await db.transaction(
			async (tx) => {
				const sharedCollections =
					await tx.query.collectionFolders.findFirst({
						with: {
							resourceCollections: { with: { resource: true } },
						},
						where: sql`EXISTS (SELECT FROM jsonb_array_elements(${collectionFolders.shared_to}) AS shared WHERE (shared->>'email') = ${user.email})`,
					});

				return [
					sharedCollections,
					sharedCollections?.resourceCollections.length || 0,
				];
			},
		);

		if (!sharedCollections) {
			return NextResponse.json(
				{
					message: "No resources found",
					data: { rows: [], totalCount: 0 },
				},
				{ status: 200 },
			);
		}

		const ids: number[] = sharedCollections.resourceCollections
			.flatMap(({ resource }) => resource?.id)
			.flat()
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

			// remove the resourceCollection value before sending it to the client
			const {
				resourceCollections: _,
				...sharedCollectionsWithoutResources
			} = sharedCollections;

			return NextResponse.json(
				{
					message: "Success",
					data: {
						rows,
						count: totalCount,
						collection: sharedCollectionsWithoutResources,
					},
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
