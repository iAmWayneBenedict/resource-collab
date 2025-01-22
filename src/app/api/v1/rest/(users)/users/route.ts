import { showPaginatedUsers, TPaginatedUsers } from "@/services/handler/user-service";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
	const { searchParams } = req.nextUrl;
	const queryParams = {
		page: searchParams.get("page") || 1,
		limit: searchParams.get("limit") || 10,
		search: searchParams.get("search") || undefined,
		sortBy: searchParams.get("sort_by") || undefined,
		sortType: searchParams.get("sort_type") || undefined,
		filter: searchParams.get("filter_by") || undefined,
	} as TPaginatedUsers;

	try {
		const users = await showPaginatedUsers(queryParams);

		return NextResponse.json(
			{
				message: "Successfully retrieved users",
				data: users,
			},
			{ status: 200 }
		);
	} catch (error) {
		return NextResponse.json(
			{ message: "Error retrieving users", data: null },
			{ status: 500 }
		);
	}
};
