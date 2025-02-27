import { NextRequest, NextResponse } from "next/server";
import { db } from "@/data/connection";
import { resources, resourceTags, tags } from "@/data/schema";
import {
	and,
	asc,
	count,
	desc,
	eq,
	exists,
	ilike,
	inArray,
	SQL,
	sql,
} from "drizzle-orm";
import { ResourcesSelectType } from "@/data/models/resources";
import { getApiPaginatedSearchParams } from "@/lib/utils";
import {
	deleteResourceTransaction,
	findResources,
} from "@/services/resource-service";
import { auth } from "@/lib/auth";

export const DELETE = async (request: NextRequest) => {
	const body = await request.json();
	const session = await auth.api.getSession({ headers: request.headers });
	const user = session?.user;

	if (!user)
		return NextResponse.json(
			{ message: "Unauthorized", data: null },
			{ status: 403 },
		);

	if (!body.ids || !Array.isArray(body.ids)) {
		return NextResponse.json(
			{ message: "Resource IDs parameter is missing", data: null },
			{ status: 404 },
		);
	}

	if (!body.type || !["soft", "hard"].includes(body.type)) {
		return NextResponse.json(
			{ message: "Type parameter is missing", data: null },
			{ status: 404 },
		);
	}

	const { ids, type } = body;

	try {
		const deletedResources = await deleteResourceTransaction({
			ids: ids as number[],
			userId: user.id,
			type: type as "soft" | "hard",
		});

		return NextResponse.json(
			{
				message: "Resource successfully retrieved",
				data: deletedResources,
			},
			{ status: 201 },
		);
	} catch (error: any) {
		console.log("Error", error.message);

		return NextResponse.json(
			{ message: "Error retrieving resource", data: null },
			{ status: 400 },
		);
	}
};

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
export const GET = async (req: NextRequest) => {
	const { searchParams } = req.nextUrl;

	const page = Number(searchParams.get("page")) || DEFAULT_PAGE;
	const limit = Number(searchParams.get("limit")) || DEFAULT_LIMIT;
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

	try {
		const { rows, totalCount } = await findResources({
			limit,
			page,
			search,
			sortBy,
			sortType,
			category: categoryParams,
			tags: tagsParams,
		});

		return NextResponse.json(
			{
				message: "Successfully retrieved resources",
				data: { rows, count: totalCount },
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
