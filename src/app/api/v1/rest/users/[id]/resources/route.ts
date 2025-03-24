import { getSession } from "@/lib/auth";
import { findUserResources } from "@/services/resource-service";
import { NextRequest, NextResponse } from "next/server";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
export const GET = async (req: NextRequest) => {
	const { searchParams } = req.nextUrl;

	const session = await getSession(req.headers);
	const user = session?.user;

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
	const resourceIds =
		searchParams
			.get("resource_ids")
			?.split(",")
			.filter((id) => id)
			.map((id) => Number(id)) ?? [];

	// filters
	const categoryParams = searchParams.get("category");
	const tagsParams =
		searchParams
			.get("tags")
			?.split(",")
			.filter((tag) => tag) ?? [];
	try {
		const { rows, totalCount } = await findUserResources({
			limit,
			page,
			search,
			sortBy,
			sortType,
			resourceIds,
			category: categoryParams,
			tags: tagsParams,
			userId: user?.id,
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
