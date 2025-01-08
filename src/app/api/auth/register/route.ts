import { TUsers } from "@/data/schema";
import { generateRandomString, alphabet } from "oslo/crypto";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { generateEmailVerificationCode } from "@/lib/auth";
import { sendVerificationRequest } from "@/services/email/emailTemplateGenerator";
import { addUser, deleteUser, getUserBy } from "@/repositories/user";
import { deleteVerificationCode } from "@/repositories/email-verification-codes";

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

	await addUser({
		id: userId,
		name: body.name,
		email: body.email,
		password: hashedPassword,
	} as TUsers);

	const verificationCode = await generateEmailVerificationCode(userId, body.email);

	try {
		// Send verification email
		console.log(verificationCode);
		await sendVerificationRequest({ identifier: body.email, code: verificationCode });
		console.log("Email sent");

		return NextResponse.json(
			{
				message: `Successfully registered!`,
				data: null,
			},
			{
				status: 200,
			}
		);
	} catch (e) {
		console.log("[Email send error] -- \n" + e);

		// Rollback
		await deleteVerificationCode(userId);
		await deleteUser(userId);

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
	const userEmail = await getUserBy("email", body.email);
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
