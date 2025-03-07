import { db } from "@/data/connection";
import { likeResources } from "@/data/schema";
import { getSession } from "@/lib/auth";
import { and, eq, exists } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
	const body = await req.json();
	const session = await getSession(req.headers);
	const user = session?.user;

	if (!user)
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	if (!body.resource_id) {
		return NextResponse.json(
			{
				message: "Resource ID is required",
				data: { path: ["resource_id"] },
			},
			{ status: 400 },
		);
	}

	try {
		await db.transaction(async (tx) => {
			const result = await tx
				.delete(likeResources)
				.where(
					and(
						eq(likeResources.user_id, user.id),
						eq(likeResources.resource_id, body.resource_id),
					),
				);

			if (!result.count) {
				await tx.insert(likeResources).values({
					user_id: user.id,
					resource_id: body.resource_id,
				});
			}
		});

		return NextResponse.json({
			message: "Successfully liked resource",
			data: null,
		});
	} catch (error) {
		return NextResponse.json(
			{ message: "Failed to create collection" },
			{ status: 500 },
		);
	}
};
