import { db } from "@/data/connection";
import { getSession } from "@/lib/auth";
import { getApiHeaders } from "@/lib/utils";
import { findAllUserResources } from "@/services/resource-service";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
	const session = await getSession(req.headers);
	const user = session?.user;

	if (!user)
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

	try {
		console.time("GET /api/v1/rest/users/all");
		const collections = await findAllUserResources({ user_id: user.id });
		console.timeEnd("GET /api/v1/rest/users/all");
		return NextResponse.json(
			{ message: "Success", data: collections },
			{ status: 200, headers: getApiHeaders(["GET"]) },
		);
	} catch (error) {
		console.log(error);
	}
};
