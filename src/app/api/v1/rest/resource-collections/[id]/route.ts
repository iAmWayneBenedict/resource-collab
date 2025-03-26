import { db } from "@/data/connection";
import { collectionFolders } from "@/data/schema";
import { getSession } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (
	req: NextRequest,
	{ params }: { params: Promise<{ id: number }> },
) => {
	const session = await getSession(req.headers);
	const user = session?.user;
	const { id } = await params;

	if (!user)
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

	if (!id) {
		return NextResponse.json({ message: "Bad Request" }, { status: 400 });
	}

	const body = await req.json();

	if (!body.name) {
		return NextResponse.json(
			{ message: "Name is required!", data: { path: ["name"] } },
			{ status: 400 },
		);
	}

	try {
		await db.transaction(async (tx) => {
			const exist = await tx
				.select()
				.from(collectionFolders)
				.where(
					and(
						eq(collectionFolders.user_id, user?.id),
						eq(collectionFolders.id, id),
					),
				);

			if (!exist.length) throw new Error("Collection does not exist!");

			await tx
				.update(collectionFolders)
				.set({ name: body.name })
				.where(
					and(
						eq(collectionFolders.user_id, user?.id),
						eq(collectionFolders.id, id),
					),
				);
		});

		return NextResponse.json(
			{ message: "Collection updated successfully!", data: null },
			{ status: 200 },
		);
	} catch (err) {
		console.log(err);
		if (err instanceof Error)
			return NextResponse.json(
				{ message: err.message, data: null },
				{ status: 404 },
			);

		return NextResponse.json(
			{ message: "Error updating collection", data: null },
			{ status: 500 },
		);
	}
};
