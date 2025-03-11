import { findAllCategory } from "@/services/category-service";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
	try {
		const categories = await findAllCategory({
			type: "all",
			with: { tags: true },
		});

		return NextResponse.json(
			{ message: "Success", data: categories },
			{ status: 200 },
		);
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{ message: "Error", data: null },
			{ status: 500 },
		);
	}
};
