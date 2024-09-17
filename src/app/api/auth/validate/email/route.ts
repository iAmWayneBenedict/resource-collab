import { db } from "@/db/connection";
import { emailVerificationCodes, users } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
	const body = await req.json();

	const isNotValid = await validate(body); // Validate the request body
	if (isNotValid) {
		return isNotValid; // Return invalid response if the request body is not valid
	}

	const { email } = body;

	// Update the user's email_verified status to true
	await db.update(users).set({ email_verified: true }).where(eq(users.email, email));

	// Delete the email verification code
	await db.delete(emailVerificationCodes).where(eq(emailVerificationCodes.email, email));

	return NextResponse.json(
		{
			data: null,
			message: "Successfully verified email!",
		},
		{
			status: 200,
		}
	);
}

/**
 * Validates the request body. Returns null if the request body is valid.
 *
 * @async
 * @param {{ code: string; email: string }} body - The request body.
 * @returns {Promise<void | response>} The validation response.
 */
const validate = async (body: { code: string; email: string }): Promise<void | Response> => {
	if (!body.code || !body.email) {
		return NextResponse.json(
			{
				data: null,
				message: "Please fill in all fields",
			},
			{
				status: 400,
			}
		);
	}

	if (body.code.length !== 6) {
		return NextResponse.json(
			{
				data: null,
				message: "Invalid code",
			},
			{
				status: 400,
			}
		);
	}

	const response = await db
		.select()
		.from(emailVerificationCodes)
		.where(
			and(
				eq(emailVerificationCodes.email, body.email),
				eq(emailVerificationCodes.code, body.code)
			)
		);

	if (response.length === 0) {
		return NextResponse.json(
			{
				data: null,
				message: "Invalid code",
			},
			{
				status: 400,
			}
		);
	}

	if (response[0].expires_at < new Date()) {
		return NextResponse.json(
			{
				data: false,
				message: "Code has expired",
			},
			{
				status: 400,
			}
		);
	}

	return;
};
