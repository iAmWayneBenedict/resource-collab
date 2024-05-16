import { db } from "@/db/connection";
import { emailVerificationCodes, sessionTable, users } from "@/db/schema";
import { generateRandomString, alphabet } from "oslo/crypto";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { lucia } from "@/config/auth/auth";
import { generateEmailVerificationCode } from "@/lib/auth";
import { sendVerificationRequest } from "@/lib/email/emailTemplateGenerator";

export async function POST(request: NextRequest) {
	const body = await request.json();

	// * Validation middleware with drizzle postgres supabase is not yet supported as of 07/04/2024
	// Validate the request
	const validationResponse = await validate(body);
	if (validationResponse) {
		return validationResponse;
	}

	const hashedPassword = await bcrypt.hash(body.password, 10);
	const userId = generateRandomString(15, alphabet("a-z", "A-Z", "0-9"));
	await db.insert(users).values({
		id: userId,
		name: body.name,
		email: body.email,
		password: hashedPassword,
	});

	const verificationCode = await generateEmailVerificationCode(userId, body.email);
	const session = await lucia.createSession(userId, {});
	const sessionCookie = lucia.createSessionCookie(session.id);

	try {
		// Send verification email
		await sendVerificationRequest({ identifier: body.email, code: verificationCode });
		console.log("Email sent");

		return NextResponse.json(
			{
				message: `Successfully registered!`,
				data: null,
			},
			{
				status: 302,
				headers: {
					Location: "/",
					"Set-Cookie": sessionCookie.serialize(),
				},
			}
		);
	} catch (e) {
		console.log("[Email send error] -- \n" + e);

		// Rollback
		await db.delete(sessionTable).where(eq(sessionTable.id, session.id));
		await db.delete(emailVerificationCodes).where(eq(emailVerificationCodes.user_id, userId));
		await db.delete(users).where(eq(users.id, userId));
		await lucia.invalidateSession(session.id);

		return NextResponse.json(
			{
				message: `Failed to send verification email`,
				data: {
					path: ["alert"],
				},
			},
			{
				status: 500,
			}
		);
	}
}

async function validate(body: {
	name: string;
	email: string;
	password: string;
	confirm_password: string;
}) {
	if (!body.name || !body.email || !body.password) {
		return NextResponse.json(
			{
				message: "Please fill in all fields",
				data: {
					path: ["name", "email", "password"],
				},
			},
			{
				status: 400,
			}
		);
	} else if (body.password.length < 8) {
		return NextResponse.json(
			{
				message: "Password must be at least 8 characters",
				data: {
					path: ["password"],
				},
			},
			{
				status: 400,
			}
		);
	} else if (body.password !== body.confirm_password) {
		return NextResponse.json(
			{
				message: "Passwords do not match",
				data: {
					path: ["confirm_password"],
				},
			},
			{
				status: 400,
			}
		);
	}
	const userEmail = await db
		.select({
			email: users.email,
		})
		.from(users)
		.where(eq(users.email, body.email));
	if (userEmail.length > 0) {
		return NextResponse.json(
			{
				message: "This email is already registered",
				data: {
					path: ["email"],
				},
			},
			{
				status: 400,
			}
		);
	}
}
