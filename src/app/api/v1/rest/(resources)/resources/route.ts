import { NextRequest, NextResponse } from "next/server";
import { globalErrorFormatter } from "../../utils";
import { CustomError } from "@/lib/error";
import { resourceService } from "@/services/handler";
import { showPaginatedResources } from "@/services/handler/resource-service";

export const DELETE = async (request: NextRequest) => {
	const body = await request.json();

	if (!("ids" in body))
		return NextResponse.json(
			{ message: "Please fill in the ids field", data: { path: ["ids"] } },
			{ status: 400 }
		);

	try {
		// delete resource through service layer
		await resourceService.removeResources(body.ids);

		return NextResponse.json({ message: "Resource deleted", data: null }, { status: 200 });
	} catch (error) {
		console.log("Error", error);

		// format error
		const [body, status] = globalErrorFormatter(error as CustomError);

		return NextResponse.json(body, status);
	}
};

export const GET = async (req: NextRequest) => {
	const { searchParams } = req.nextUrl;
	const queryParams = {
		page: searchParams.get("page") || 1,
		limit: searchParams.get("limit") || 10,
		search: searchParams.get("search") || undefined,
		sortBy: searchParams.get("sort_by") || undefined,
		sortType: searchParams.get("sort_type") || undefined,
		filter: searchParams.get("filter_by") || undefined,
	} as TPaginatedProps;

	try {
		const users = await showPaginatedResources(queryParams);

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
