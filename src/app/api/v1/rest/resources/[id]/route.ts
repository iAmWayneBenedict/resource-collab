import { NextRequest, NextResponse } from "next/server";
import { db } from "@/data/connection";
import { inArray } from "drizzle-orm";
import { resources } from "@/data/schema";
import {
	findResource,
	updateResourceTransaction,
} from "@/services/resource-service";
import { auth, getSession } from "@/lib/auth";

export async function GET(
	_: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const { id: paramsId } = await params;

	if (!paramsId)
		return NextResponse.json(
			{ message: "Resource ID parameter is missing", data: null },
			{ status: 404 },
		);

	try {
		const resource = await findResource({
			value: paramsId,
			identifier: "id",
		});

		return NextResponse.json(
			{ message: "Resource successfully retrieved", data: resource },
			{ status: 201 },
		);
	} catch (error: any) {
		console.log("Error", error.message);

		return NextResponse.json(
			{ message: "Error retrieving resource", data: null },
			{ status: 400 },
		);
	}
}

export const PUT = async (
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) => {
	const { id } = await params;
	const body = await request.json();
	const session = await getSession(request.headers);
	const user = session?.user;

	if (!user)
		return NextResponse.json(
			{ message: "Unauthorized", data: null },
			{ status: 403 },
		);

	try {
		const validationResponse = validate(body);

		if (validationResponse) return validationResponse;

		const updatedResource = await updateResourceTransaction({
			...body,
			id,
			userId: user.id,
		});

		return NextResponse.json(
			{
				message: "Resource updated Successfully",
				data: [updatedResource],
			},
			{ status: 201 },
		);
	} catch (error) {
		console.log("Error", error);

		return NextResponse.json(
			{ message: "Error updating resource", data: null },
			{ status: 400 },
		);
	}
};

// export const DELETE = async (
// 	request: NextRequest,
// 	{ params }: { params: { id: number } },
// ) => {
// 	const session = await auth.api.getSession({ headers: request.headers });
// 	const user = session?.user;

// 	if (!user)
// 		return NextResponse.json(
// 			{ message: "Unauthorized", data: null },
// 			{ status: 403 },
// 		);
// 	if (!params.id)
// 		return NextResponse.json(
// 			{ message: "Resource ID parameter is missing", data: null },
// 			{ status: 404 },
// 		);

// 	try {
// 		await db
// 			.delete(resources)
// 			.where(inArray(resources.id, [params.id]))
// 			.returning();

// 		return NextResponse.json(
// 			{ message: "Resource deleted", data: null },
// 			{ status: 200 },
// 		);
// 	} catch (error) {
// 		console.log("Error", error);

// 		return NextResponse.json(
// 			{ message: "Error deleting resource", data: null },
// 			{ status: 400 },
// 		);
// 	}
// };

const validate = (body: any) => {
	const requiredFields = ["name", "icon", "category"];
	const missingFields = requiredFields.filter((field) => !body[field]);

	if (missingFields.length > 0) {
		return NextResponse.json(
			{
				message: `Please fill in the ${missingFields.join(", ")} field(s)`,
				data: { path: missingFields },
			},
			{ status: 400 },
		);
	}
	return null;
};
