import { NextRequest, NextResponse } from "next/server";

import { authService } from "@/services/handler";
import { CustomError } from "@/lib/error";

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

	// register user
	try {
		await authService.register(body);

		return NextResponse.json(
			{
				message: "User created successfully",
				data: null,
			},
			{
				status: 201,
			}
		);
	} catch (error: CustomError | any) {
		return NextResponse.json(
			{ message: error.message, data: error.data },
			{ status: error.code }
		);
	}
}
