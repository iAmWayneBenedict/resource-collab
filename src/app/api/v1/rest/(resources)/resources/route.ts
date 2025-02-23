import { NextRequest, NextResponse } from "next/server";
import { db } from "@/data/connection";
import { resources, resourceTags, userResources } from "@/data/schema";
import { and, asc, count, desc, eq, ilike, inArray, sql } from "drizzle-orm";
import { ResourcesSelectType } from "@/data/models/resources";
import { getApiPaginatedSearchParams } from "@/lib/utils";
import { deleteResourceTransaction } from "@/services/resource-service";
import { auth } from "@/lib/auth";

export const DELETE = async (request: NextRequest) => {
	const body = await request.json();
	const user = { id: body.userId, role: "admin" };
	// const session = await auth.api.getSession({ headers: request.headers });
	// const user = session?.user;

	// if (!user)
	// 	return NextResponse.json(
	// 		{ message: "Unauthorized", data: null },
	// 		{ status: 401 },
	// 	);

	if (!("ids" in body))
		return NextResponse.json(
			{
				message: "Please fill in the ids field",
				data: { path: ["ids"] },
			},
			{ status: 400 },
		);

	try {
		const exists = await db
			.select()
			.from(userResources)
			.where(
				and(
					inArray(userResources.resource_id, body.ids),
					eq(userResources.user_id, body.userId),
				),
			);
		if (!exists.length)
			return NextResponse.json(
				{ message: "Resource does not exist", data: null },
				{ status: 404 },
			);
	} catch (error) {
		console.log("Error", error);
		return NextResponse.json(
			{ message: "Error deleting resource", data: null },
			{ status: 400 },
		);
	}

	try {
		console.log(body);
		const deletedIds = await deleteResourceTransaction({
			...body,
			userId: user.id,
		});

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

	const { page, limit, search, sortBy, sortType, filterBy, filterValue } =
		getApiPaginatedSearchParams(searchParams);

	try {
		const [{ totalCount }] = await db
			.select({ totalCount: count() })
			.from(resources);

		const filters = [];
		if (search)
			filters.push(ilike(resources.name, sql.placeholder("search")));

		if (filterBy && filterValue)
			filters.push(
				eq(
					resources[filterBy as keyof ResourcesSelectType],
					sql.placeholder("filterValue"),
				),
			);

		const tagFilters = [];
		if (filterBy === "tag")
			tagFilters.push(
				eq(resourceTags.tag_id, sql.placeholder("filterBy")),
			);

		const sortValue = sortBy
			? (sortType === "ascending" ? asc : desc)(
					resources[sortBy as keyof ResourcesSelectType],
				)
			: asc(resources.id);

		const query = db.query.resources
			.findMany({
				with: {
					category: {
						columns: {
							id: true,
							name: true,
						},
					},
					resourceTags: {
						columns: {
							resource_id: false,
							tag_id: false,
						},
						with: { tag: true },
						where: tagFilters.length
							? and(...tagFilters)
							: undefined,
					},
				},
				where: filters.length ? and(...filters) : undefined,
				offset: sql.placeholder("offset"),
				limit: sql.placeholder("limit"),
				orderBy: [sortValue],
			})
			.prepare("all_resources");

		const rows = await query.execute({
			search: `%${search}%`,
			offset: (page - 1) * limit,
			limit: Number(limit),
			filterBy,
			filterValue,
		});

		return NextResponse.json(
			{
				message: "Successfully retrieved resources",
				data: {
					rows,
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
