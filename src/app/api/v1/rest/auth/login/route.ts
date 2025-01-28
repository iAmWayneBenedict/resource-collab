import { NextRequest, NextResponse } from "next/server";
import { users } from "@/data/schema";
import { db } from "@/data/connection";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { createSession } from "../../utils";

export async function POST(request: NextRequest) {
	const body = await request.json();

	if (!body.email || !body.password) {
		return NextResponse.json(
			{ message: "Please fill in all fields", data: { path: ["alert"] } },
			{ status: 400 }
		);
	}
	try {
		const { email, password } = body;

		const user = await db.select().from(users).where(eq(users.email, email));

		if (user.length === 0) {
			return NextResponse.json(
				{ message: "Invalid email or password", data: { path: ["alert"] } },
				{ status: 400 }
			);
		}

		const userRecord = user[0];

		const isMatchPassword = await bcrypt.compare(password, userRecord.password as string);

		if (!isMatchPassword) {
			return NextResponse.json(
				{ message: "Invalid email or password", data: { path: ["alert"] } },
				{ status: 400 }
			);
		}

		await createSession(userRecord.id as string);

		return NextResponse.json(
			{ message: "User logged in successfully", data: null },
			{ status: 200 }
		);
	} catch (error: any) {
		return NextResponse.json(
			{ message: "Error logging in user", data: { path: ["alert"] } },
			{ status: 400 }
		);
	}
}
