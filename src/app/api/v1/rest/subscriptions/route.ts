import { db } from "@/data/connection";
import { subscriptions } from "@/data/schema";
import { asc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
	try {
		const rows = await db
			.select()
			.from(subscriptions)
			.orderBy(asc(subscriptions.id));

		return NextResponse.json(
			{ message: "Success", data: rows },
			{ status: 200 },
		);
	} catch (err: any) {
		if (err instanceof Error) {
			return NextResponse.json(
				{ message: err.message, data: null },
				{ status: 500 },
			);
		}
		return NextResponse.json(
			{ message: "Server error", data: null },
			{ status: 500 },
		);
	}
};
