import { NextRequest, NextResponse } from "next/server";
import { globalErrorFormatter } from "../../utils";
import { CustomError } from "@/lib/error";
import { db } from "@/data/connection";
import { resourceCategories, resources, resourceToCategories } from "@/data/schema";
import { eq, inArray } from "drizzle-orm";

export async function POST(request: NextRequest) {
	const body = await request.json();
	try {
		const validationResponse = validate(body);
		if (validationResponse) return validationResponse;

		const { name, categories } = body;

		const existingResource = await db.select().from(resources).where(eq(resources.name, name));

		const existingCategories = await db
			.select()
			.from(resourceCategories)
			.where(inArray(resourceCategories.id, categories));

		if (existingResource.length == 0) {
			return NextResponse.json({ message: "No category found", data: null }, { status: 404 });
		}

		const categoryIdsFound = existingCategories.map((category) => category.id);

		// check if categories exist
		for (const category of categories) {
			if (!categoryIdsFound.includes(category)) {
				return NextResponse.json(
					{ message: "No category found", data: null },
					{ status: 404 }
				);
			}
		}
		const junctionQueryValues = categories.map((category: number) => ({
			resource_id: existingResource[0].id,
			category_id: category,
		}));

		try {
			await db.insert(resourceToCategories).values(junctionQueryValues).returning();
		} catch (error) {
			console.log(error);

			return NextResponse.json(
				{ message: "Error creating resource", data: null },
				{ status: 500 }
			);
		}

		return NextResponse.json(
			{ message: "Resource created", data: existingCategories },
			{ status: 201 }
		);
	} catch (error) {
		console.log("Error", error);

		return NextResponse.json(
			{ message: "Error creating resource", data: null },
			{ status: 400 }
		);
	}
}

const validate = (body: any) => {
	const requiredFields = ["name", "icon"];
	const missingFields = requiredFields.filter((field) => !body[field]);

	if (missingFields.length > 0) {
		return NextResponse.json(
			{
				message: `Please fill in the ${missingFields.join(", ")} field(s)`,
				data: {
					path: missingFields,
				},
			},
			{ status: 400 }
		);
	}
	return null;
};
