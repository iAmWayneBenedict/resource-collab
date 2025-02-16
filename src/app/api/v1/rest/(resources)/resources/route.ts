import { NextRequest, NextResponse } from "next/server";
import { db } from "@/data/connection";
import { resources, TResources } from "@/data/schema";
import { and, asc, count, desc, eq, ilike, inArray } from "drizzle-orm";

export const DELETE = async (request: NextRequest) => {
	const body = await request.json();

	if (!("ids" in body))
		return NextResponse.json(
			{
				message: "Please fill in the ids field",
				data: { path: ["ids"] },
			},
			{ status: 400 },
		);

	try {
		// delete resource through service layer
		await db.delete(resources).where(inArray(resources.id, body.ids));

		return NextResponse.json(
			{ message: "Resource deleted", data: null },
			{ status: 200 },
		);
	} catch (error) {
		console.log("Error", error);

		return NextResponse.json(
			{ message: "Error deleting resource", data: null },
			{ status: 400 },
		);
	}
};

export const GET = async (req: NextRequest) => {
	const { searchParams } = req.nextUrl;

	const page = Number(searchParams.get("page")) || 1;
	const limit = Number(searchParams.get("limit")) || 10;
	const search = searchParams.get("search") || undefined;
	const sortBy = searchParams.get("sort_by") || undefined;
	const sortType = searchParams.get("sort_type") || undefined;
	const filterBy = searchParams.get("filter_by") || undefined;
	const filterValue = searchParams.get("filter_value") || undefined;

	try {
		const [{ totalCount }] = await db
			.select({ totalCount: count() })
			.from(resources);

		const filters = [];
		if (search) filters.push(ilike(resources.name, `%${search}%`));
		if (filterBy && filterValue)
			filters.push(
				eq(resources[filterBy as keyof TResources], filterValue),
			);

		const sortValue = sortBy
			? (sortType === "ascending" ? asc : desc)(
					resources[sortBy as keyof TResources],
				)
			: asc(resources.id);

		const query = await db.query.resources.findMany({
			with: { category: true, resourceTags: { with: { tag: true } } },
			where: filters.length ? and(...filters) : undefined,
			offset: (page - 1) * limit,
			limit: Number(limit),
			orderBy: [sortValue],
		});

		return NextResponse.json(
			{
				message: "Successfully retrieved resources",
				data: {
					rows: query,
					count: totalCount,
				},
			},
			{ status: 200 },
		);
	} catch (error) {
		console.log("Error", error);
		return NextResponse.json(
			{ message: "Error retrieving resources", data: null },
			{ status: 500 },
		);
	}
};
