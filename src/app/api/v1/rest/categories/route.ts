import { getApiHeaders } from "@/lib/utils";
import { findAllCategory } from "@/services/category-service";
import { NextResponse } from "next/server";

export const GET = async () => {
	try {
		const categories = await findAllCategory({
			type: "all",
			with: { tags: true },
		});

		return NextResponse.json(
			{ message: "Success", data: categories },
			{
				status: 200,
				headers: getApiHeaders(["GET"]),
			},
		);
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{ message: "Error", data: null },
			{
				status: 500,
				headers: getApiHeaders(["GET"]),
			},
		);
	}
};
