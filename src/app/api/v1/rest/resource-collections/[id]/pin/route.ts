import { db } from "@/data/connection";
import { collectionFolders, pinned } from "@/data/schema";
import { getSession } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
	req: NextRequest,
	{ params }: { params: Promise<{ id: number }> },
) => {
	const session = await getSession(req.headers);
	const user = session?.user;
	const { id } = await params;

	if (!user)
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

	const exist = await db
		.select({ id: collectionFolders.id })
		.from(collectionFolders)
		.where(eq(collectionFolders.id, id));

	if (!exist.length)
		return NextResponse.json(
			{ message: "Collection not found" },
			{ status: 201 },
		);

	try {
		await db.insert(pinned).values({
			collection_id: exist[0].id,
			user_id: user.id,
		});
		
		return NextResponse.json({message: "Successfully pinned collection!", data: null}, {status: 200})
	} catch (err) {
		console.log(err);
		return NextResponse.json({ message: "Server error" }, { status: 500 });
	}
};
export const DELETE = async (
	req: NextRequest,
	{ params }: { params: Promise<{ id: number }> },
) => {
	const session = await getSession(req.headers);
	const user = session?.user;
	const { id } = await params;

	if (!user)
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

	const exist = await db
		.select({ id: collectionFolders.id })
		.from(collectionFolders)
		.where(eq(collectionFolders.id, id));

	if (!exist.length)
		return NextResponse.json(
			{ message: "Collection not found" },
			{ status: 201 },
		);

	try {
		await db
			.delete(pinned)
			.where(
				and(
					eq(pinned.collection_id, exist[0].id),
					eq(pinned.user_id, user.id),
				),
			);
		return NextResponse.json({message: "Successfully unpinned collection!", data: null}, {status: 200})
	} catch (err) {
		console.log(err);
		return NextResponse.json({ message: "Server error" }, { status: 500 });
	}
};
