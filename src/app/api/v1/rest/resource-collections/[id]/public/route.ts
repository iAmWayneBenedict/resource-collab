import { db } from "@/data/connection";
import { collectionFolders } from "@/data/schema";
import { findResources } from "@/services/resource-service";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) => {
	const { id } = await params;
	const searchParams = req.nextUrl.searchParams;

	if (!id) {
		return NextResponse.json({ message: "Bad Request" }, { status: 400 });
	}

	const exist = await db
		.select()
		.from(collectionFolders)
		.where(eq(collectionFolders.id, id));

	if (!exist.length || exist[0].access_level !== "public") {
		return NextResponse.json(
			{ message: "Collection not found" },
			{ status: 404 },
		);
	}

	const [sharedCollections, totalCount] = await db.transaction(async (tx) => {
		const sharedCollections = await tx.query.collectionFolders.findFirst({
			with: {
				resourceCollections: { with: { resource: true } },
				user: {
					columns: {
						id: true,
						name: true,
						image: true,
						email: true,
					},
				},
			},
			where: eq(collectionFolders.id, id),
		});

		return [
			sharedCollections,
			sharedCollections?.resourceCollections.length || 0,
		];
	});

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
			userId: undefined,
		});

		// remove the resourceCollection value before sending it to the client
		const { resourceCollections: _, ...sharedCollectionsWithoutResources } =
			sharedCollections;

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
};
