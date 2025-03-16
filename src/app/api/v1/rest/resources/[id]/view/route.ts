import { db } from "@/data/connection";
import { resources } from "@/data/schema";
import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (
	req: NextRequest,
	{ params }: { params: Promise<{ id: number }> },
) => {
	const body = await req.json();
	const { id } = await params;

	if (!id) {
		return NextResponse.json(
			{
				message: "Parameter 'id' is required",
				data: null,
			},
			{ status: 400 },
		);
	}
	if (!body.view_count) {
		return NextResponse.json(
			{
				message: "Field 'view_count' is required",
				data: null,
			},
			{ status: 400 },
		);
	}

	try {
		await db
			.update(resources)
			.set({ view_count: body.view_count })
			.where(eq(resources.id, id));
	} catch (error) {
		return Response.json({ message: error, data: null }, { status: 500 });
	}

	return Response.json({ message: "Success" }, { status: 200 });
};
