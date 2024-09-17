import { validateRequest } from "@/lib/auth";
import { NextResponse, NextRequest } from "next/server";

// To handle a GET request to /api
export async function GET(request: NextRequest, response: NextResponse) {
	const user = await validateRequest();

	if (!user || !user.session || !user.user) {
		return NextResponse.json(
			{ message: "Unauthorized", data: null },
			{
				status: 401,
			}
		);
	}

	return NextResponse.json(
		{
			message: "User retrieved",
			data: {
				email: user.user.email,
				name: user.user.name,
			},
		},
		{
			status: 200,
		}
	);
}
