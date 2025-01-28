import { NextRequest, NextResponse } from "next/server";
import { db } from "@/data/connection";
import { resources, TResources } from "@/data/schema";
import { asc, count, desc, ilike, inArray } from "drizzle-orm";

export const DELETE = async (request: NextRequest) => {
	const body = await request.json();

	if (!("ids" in body))
		return NextResponse.json(
			{ message: "Please fill in the ids field", data: { path: ["ids"] } },
			{ status: 400 }
		);

	try {
		// delete resource through service layer
		await db.delete(resources).where(inArray(resources.id, body.ids));

		return NextResponse.json({ message: "Resource deleted", data: null }, { status: 200 });
	} catch (error) {
		console.log("Error", error);

		return NextResponse.json(
			{ message: "Error deleting resource", data: null },
			{ status: 400 }
		);
	}
};

export const GET = async (req: NextRequest) => {
	const { searchParams } = req.nextUrl;

	const page = Number(searchParams.get("page")) || 1;
	const limit = Number(searchParams.get("limit")) || 10;
	const search = searchParams.get("search") || undefined;
	const sortBy = (searchParams.get("sort_by") as keyof TResources) || undefined;
	const sortType = searchParams.get("sort_type") || undefined;
	const filterBy = searchParams.get("filter_by") || undefined;
	const filterValue = searchParams.get("filter_value") || undefined;

	try {
		// const resources = await showPaginatedResources(queryParams);
		const countData = await db.select({ resourceCount: count() }).from(resources);

		const searchValue = search ? ilike(resources.name, `%${search}%`) : undefined;

		const filterValueQuery =
			filterBy && filterValue
				? ilike(resources[filterBy as keyof TResources], `%${filterValue}%`)
				: undefined;

		const sortValue = sortBy
			? (sortType === "ascending" ? asc : desc)(resources[sortBy as keyof TResources])
			: asc(resources.id);

		const query = await db.query.resources.findMany({
			with: { resourceToCategory: { with: { category: true } } },
			where: searchValue ? searchValue : filterValueQuery,
			offset: (page - 1) * limit,
			limit: Number(limit),
			orderBy: [sortValue],
		});

		return NextResponse.json(
			{
				message: "Successfully retrieved resources",
				data: {
					rows: query,
					count: countData[0].resourceCount,
				},
			},
			{ status: 200 }
		);
	} catch (error) {
		console.log("Error", error);
		return NextResponse.json(
			{ message: "Error retrieving resources", data: null },
			{ status: 500 }
		);
	}
};
