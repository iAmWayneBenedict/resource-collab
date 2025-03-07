// For adding resource to existing collection
import { addResourceToCollection } from "@/services/resource-collection-service";
import { getSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
	const body = await req.json();
	const session = await getSession(req.headers);
	const user = session?.user;

	if (!user)
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

	const missingFields = [];
	if (!body.collection_folder_ids)
		missingFields.push("collection_folder_ids");
	if (!body.resource_id) missingFields.push("resource_id");

	if (missingFields.length > 0) {
		return NextResponse.json(
			{
				message: "Missing required fields",
				data: { path: missingFields },
			},
			{ status: 400 },
		);
	}

	try {
		const result = await addResourceToCollection(
			user.id,
			Number(body.resource_id),
			body.collection_folder_ids,
		);
		return NextResponse.json({ message: "Resource added", data: result });
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{ message: "Failed to add resource" },
			{ status: 500 },
		);
	}
};
