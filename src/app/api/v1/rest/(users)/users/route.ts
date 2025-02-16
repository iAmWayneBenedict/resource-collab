import { db } from "@/data/connection";
import { TUsers, users } from "@/data/schema";
import { getApiPaginatedSearchParams } from "@/lib/utils";
import { and, asc, count, desc, eq, ilike } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
	const { page, limit, search, sortBy, sortType, filterBy, filterValue } =
		getApiPaginatedSearchParams(req.nextUrl.searchParams);

	try {
		const [{ totalCount }] = await db
			.select({ totalCount: count() })
			.from(users);

		const filters = [];
		if (search) filters.push(ilike(users.name, `%${search}%`));

		if (filterBy && filterValue)
			filters.push(eq(users[filterBy as keyof TUsers], filterValue));

		const sortValue = sortBy
			? (sortType === "ascending" ? asc : desc)(
					users[sortBy as keyof TUsers],
				)
			: asc(users.id);

		const query = await db.query.users.findMany({
			columns: {
				id: true,
				name: true,
				email: true,
				role: true,
				email_verified: true,
				created_at: true,
				updated_at: true,
			},

			where: filters.length ? and(...filters) : undefined,
			offset: (page - 1) * limit,
			limit: Number(limit),
			orderBy: [sortValue],
		});

		return NextResponse.json(
			{
				message: "Successfully retrieved users",
				data: {
					rows: query,
					count: totalCount,
				},
			},
			{ status: 200 },
		);
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{ message: "Error retrieving users", data: null },
			{ status: 500 },
		);
	}
};
