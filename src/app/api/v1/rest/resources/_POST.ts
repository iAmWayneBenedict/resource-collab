import { NextRequest, NextResponse } from "next/server";
import { createResource } from "@/services/handler/resource-service";
import { globalErrorFormatter } from "../utils";
import { CustomError } from "@/lib/error";

export async function POST(request: NextRequest) {
	const body = await request.json();
	try {
		const validationResponse = await validate(body);
		if (validationResponse) return validationResponse;

		// add resource through service layer
		const newResource = createResource(body);

		return NextResponse.json(
			{ message: "Resource created", data: newResource },
			{ status: 201 }
		);
	} catch (error) {
		console.log("Error", error);

		// format error
		const [body, status] = globalErrorFormatter(error as CustomError);

		return NextResponse.json(body, status);
	}
}

const validate = async (body: any) => {
	const requiredFields = ["name", "icon", "userId"];
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
