// For creating new collections
import {
	createCollectionWithResource,
	createEmptyCollection,
} from "@/services/resource-collection-service";
import { getSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import {
	exceededSubscriptionLimitCountHandler,
	getApiHeaders,
} from "../../../../../../lib/utils";

export const POST = async (req: NextRequest) => {
	const body = await req.json();
	const session = await getSession(req.headers);
	const user = session?.user;

	if (!user)
		return NextResponse.json(
			{ message: "Unauthorized" },
			{ status: 401, headers: getApiHeaders(["POST"]) },
		);
	if (!body.name) {
		return NextResponse.json(
			{ message: "Name is required", data: { path: ["name"] } },
			{ status: 400, headers: getApiHeaders(["POST"]) },
		);
	}

	try {
		const result = body.resource_id
			? await createCollectionWithResource(
					user.id,
					body.name,
					Number(body.resource_id),
				)
			: await createEmptyCollection(user.id, body.name);

		return NextResponse.json(
			{
				message: "Collection created",
				data: result,
			},
			{ status: 200, headers: getApiHeaders(["POST"]) },
		);
	} catch (error) {
		if (error instanceof Error)
			return NextResponse.json(
				{
					message: error.message,
					data: exceededSubscriptionLimitCountHandler(error) || {
						path: ["name"],
					},
				},
				{ status: 400, headers: getApiHeaders(["POST"]) },
			);

		return NextResponse.json(
			{ message: "Failed to create collection" },
			{ status: 500, headers: getApiHeaders(["POST"]) },
		);
	}
};

export const OPTIONS = async (req: NextRequest) => {
	return NextResponse.json(
		{},
		{ status: 200, headers: getApiHeaders(["OPTIONS"]) },
	);
};
