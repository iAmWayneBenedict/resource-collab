import { logout } from "@/lib/auth";
import { NextResponse, NextRequest } from "next/server";

// To handle a GET request to /api
export async function GET(request: NextRequest, response: NextResponse) {
	const logoutResponse = await logout();

	if (logoutResponse.error) {
		return NextResponse.json(
			{
				message: logoutResponse.error,
				data: null,
			},
			{
				status: 400,
			}
		);
	}

	return NextResponse.json(
		{
			message: "Successfully logged out",
			data: null,
		},
		{
			status: 200,
		}
	);
}
