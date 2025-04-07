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
				headers: {
					"Access-Control-Allow-Origin": "http://localhost:3001",
					"Access-Control-Allow-Methods": "GET",
					"Access-Control-Allow-Headers":
						"Content-Type, Authorization",
				},
			},
		);
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{ message: "Error", data: null },
			{
				status: 500,
				headers: {
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Methods": "GET",
					"Access-Control-Allow-Headers":
						"Content-Type, Authorization",
				},
			},
		);
	}
};
