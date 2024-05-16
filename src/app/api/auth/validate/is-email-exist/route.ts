import { db } from "@/db/connection";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
	const email = req.nextUrl.searchParams.get("email") as string;
	const response = await db.select().from(users).where(eq(users.email, email));

	return NextResponse.json({
		data: response.length > 0, // If the email exists, return true
		message: "Success",
	});
}
