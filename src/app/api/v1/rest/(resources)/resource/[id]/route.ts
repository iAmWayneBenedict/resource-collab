import { NextRequest, NextResponse } from "next/server";
import { db } from "@/data/connection";
import { eq, inArray, sql } from "drizzle-orm";
import { resourceCategories, resources } from "@/data/schema";

export async function GET(request: NextRequest, { params }: { params: { id: number } }) {
	if (!params.id)
		return NextResponse.json(
			{ message: "Resource ID parameter is missing", data: null },
			{ status: 404 }
		);

	try {
		const resource = await db.select().from(resources).where(eq(resources.id, params.id));

		return NextResponse.json(
			{ message: "Resource successfully retrieved", data: resource },
			{ status: 201 }
		);
	} catch (error: any) {
		console.log("Error", error.message);

		return NextResponse.json(
			{ message: "Error retrieving resource", data: null },
			{ status: 400 }
		);
	}
}

export const PUT = async (request: NextRequest) => {
	const body = await request.json();

	try {
		const validationResponse = validate(body);

		if (validationResponse) return validationResponse;

		const { categories, ...resource } = body;

		if (!categories.delete || !categories.add) {
			return NextResponse.json(
				{
					message: "Invalid category. It should have 'deleted' and 'add' properties",
					data: null,
				},
				{ status: 400 }
			);
		}

		if (categories.delete.length) {
			await db
				.delete(resourceCategories)
				.where(inArray(resourceCategories.id, categories.delete));
		}
		if (categories.add.length) {
			await db.insert(resourceCategories).values(categories.add);
		}

		const updatedResource = await db
			.update(resources)
			.set(resource)
			.where(eq(resources.id, body.id))
			.returning();

		return NextResponse.json(
			{ message: "Resource updated Successfully", data: updatedResource },
			{ status: 201 }
		);
	} catch (error) {
		console.log("Error", error);

		return NextResponse.json(
			{ message: "Error updating resource", data: null },
			{ status: 400 }
		);
	}
};

export const DELETE = async (request: NextRequest, { params }: { params: { id: number } }) => {
	if (!params.id)
		return NextResponse.json(
			{ message: "Resource ID parameter is missing", data: null },
			{ status: 404 }
		);

	try {
		await db
			.delete(resources)
			.where(inArray(resources.id, [params.id]))
			.returning();

		return NextResponse.json({ message: "Resource deleted", data: null }, { status: 200 });
	} catch (error) {
		console.log("Error", error);

		return NextResponse.json(
			{ message: "Error deleting resource", data: null },
			{ status: 400 }
		);
	}
};

const validate = (body: any) => {
	const requiredFields = ["name", "icon", "user_id"];
	const missingFields = requiredFields.filter((field) => !body[field]);

	if (missingFields.length > 0) {
		return NextResponse.json(
			{
				message: `Please fill in the ${missingFields.join(", ")} field(s)`,
				data: { path: missingFields },
			},
			{ status: 400 }
		);
	}
	return null;
};
