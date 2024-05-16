import { db } from "@/db/connection";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { createSession } from "../../utils";
import { validateRequest } from "@/lib/auth";

export async function POST(request: NextRequest) {
	const body = await request.json();
	const isNotValid = await validate(body);
	if (isNotValid) return isNotValid;

	return NextResponse.json(
		{
			message: "Logged in successfully",
			data: null,
		},
		{
			status: 200,
		}
	);
}

const validate = async (body: { email: string; password: string }) => {
	const { email, password } = body;

	if (!email || !password) {
		return NextResponse.json(
			{
				message: "Please fill in all fields",
				data: {
					path: ["alert"],
				},
			},
			{
				status: 400,
			}
		);
	}

	const user = await db.select().from(users).where(eq(users.email, email));
	if (user.length === 0) {
		return NextResponse.json(
			{
				message: "Invalid email or password",
				data: {
					path: ["alert"],
				},
			},
			{
				status: 400,
			}
		);
	}

	// Check password
	const userRecord = user[0];

	const passwordMatch = await bcrypt.compare(password, userRecord.password!);

	if (!passwordMatch) {
		return NextResponse.json(
			{
				message: "Invalid email or password",
				data: {
					path: ["alert"],
				},
			},
			{
				status: 400,
			}
		);
	}

	// create a new session by setting the session cookie
	await createSession(userRecord.id);

	return null;
};
