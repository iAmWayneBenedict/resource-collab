import { db } from "@/data/connection";
import { TUsers, users, usersEnum } from "@/data/schema";
import { asc, count, desc, eq, ilike } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
	const { searchParams } = req.nextUrl;

	const page = Number(searchParams.get("page")) || 1;
	const limit = Number(searchParams.get("limit")) || 10;
	const search = searchParams.get("search") || undefined;
	const sortBy = searchParams.get("sort_by") || undefined;
	const sortType = searchParams.get("sort_type") || undefined;
	const filter = searchParams.get("filter_by") || undefined;

	try {
		const query = db
			.select({
				id: users.id,
				name: users.name,
				email: users.email,
				role: users.role,
				email_verified: users.email_verified,
				created_at: users.created_at,
				updated_at: users.updated_at,
			})
			.from(users);
		if (page && limit) {
			query.limit(limit).offset((page - 1) * limit);
		}
		if (search) {
			query.where(ilike(users.name, `%${search}%`));
		}
		if (sortBy && sortType) {
			const sortFn = sortType === "ascending" ? asc : desc;
			query.orderBy(sortFn(users[sortBy as keyof TUsers]));
		}
		if (filter) {
			query.where(eq(users.role, filter as (typeof usersEnum.enumValues)[number]));
		}

		const countData = await db.select({ userCount: count() }).from(users);

		return NextResponse.json(
			{
				message: "Successfully retrieved users",
				data: {
					rows: await query,
					count: countData[0].userCount,
				},
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
