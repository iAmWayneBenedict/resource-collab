import { NextRequest, NextResponse } from "next/server";
import { authService } from "@/services/handler";
import { CustomError } from "@/lib/error";

export async function POST(request: NextRequest) {
	const body = await request.json();

	if (!body.email || !body.password) {
		return NextResponse.json(
			{ message: "Please fill in all fields", data: { path: ["alert"] } },
			{ status: 400 }
		);
	}
	try {
		await authService.login(body);
		return NextResponse.json(
			{ message: "User logged in successfully", data: null },
			{ status: 200 }
		);
	} catch (error: CustomError | any) {
		return NextResponse.json(
			{ message: error.message, data: error.data },
			{ status: error.code }
		);
	}
}
