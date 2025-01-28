import { NextRequest, NextResponse } from "next/server";

import { generateEmailVerificationCode, validateRequest } from "@/lib/auth";
import { db } from "@/data/connection";
import { users } from "@/data/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { alphabet, generateRandomString } from "oslo/crypto";
import { sendVerificationRequest } from "@/services/email/emailTemplateGenerator";

export async function POST(request: NextRequest) {
	const body = await request.json();

	// validate request
	if (!body.name || !body.email || !body.password) {
		return NextResponse.json(
			{
				message: "Please fill in all fields",
				data: { path: ["name", "email", "password"] },
			},
			{ status: 400 }
		);
	} else if (body.password.length < 8) {
		return NextResponse.json(
			{
				message: "Password must be at least 8 characters",
				data: { path: ["password"] },
			},
			{ status: 400 }
		);
	} else if (body.password !== body.confirm_password) {
		return NextResponse.json(
			{
				message: "Passwords do not match",
				data: { path: ["confirm_password"] },
			},
			{ status: 400 }
		);
	}

	const session = await validateRequest();

	if (!session || !session.user || session.user.role !== "admin") {
		return NextResponse.json({ message: "Unauthorized", data: null }, { status: 401 });
	}

	// register user
	try {
		// await authService.register(body);
		const userEmail = await db.select().from(users).where(eq(users.email, body.email));

		if (userEmail.length > 0) {
			return NextResponse.json(
				{ message: "Email already exists", data: { path: ["email"] } },
				{ status: 400 }
			);
		}

		const hashedPassword = await bcrypt.hash(body.password, 10);
		const userId = generateRandomString(15, alphabet("a-z", "A-Z", "0-9"));

		if (body.adminCreateUser) {
			await db.insert(users).values({
				id: userId,
				name: body.name,
				email: body.email,
				password: hashedPassword,
				role: "admin",
				created_at: new Date(),
				updated_at: new Date(),
			});

			return NextResponse.json(
				{ message: "User created successfully", data: { id: userId } },
				{ status: 201 }
			);
		}

		await db.insert(users).values({
			id: userId,
			name: body.name,
			email: body.email,
			password: hashedPassword,
			role: "user",
			created_at: new Date(),
			updated_at: new Date(),
		});

		const verificationCode = await generateEmailVerificationCode(userId, body.email);

		await sendVerificationRequest({ identifier: body.email, code: verificationCode });

		return NextResponse.json(
			{ message: "User created successfully", data: { id: userId } },
			{ status: 201 }
		);
	} catch (error: any) {
		console.log(error);
		return NextResponse.json({ message: "Error creating user", data: null }, { status: 400 });
	}
}
