import { NextRequest, NextResponse } from "next/server";
import { createResource } from "@/services/handler/resource-service";
import { globalErrorFormatter } from "../../../utils";
import { CustomError } from "@/lib/error";
import { resourceService } from "@/services/handler";

export async function GET(request: NextRequest, {params}: {params: {id: number}}) {

	if(!params.id) return NextResponse.json({message: "Resource ID parameter is missing", data: null}, {status: 404})

	try {
		const resource = await resourceService.showResource(params.id)

		return NextResponse.json({message: "Resource successfully retrieved", data: resource}, {status: 201})
	} catch(error:any) {
		console.log("Error", error.message)

		const [body, status] = globalErrorFormatter(error as CustomError)
		return NextResponse.json(body, status)
	}
}

export async function POST(request: NextRequest) {
	const body = await request.json();
	try {
		const validationResponse =  validate(body);
		if (validationResponse) return validationResponse;

		// add resource through service layer
		const newResource = await createResource(body);

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

export const PUT = async (request: NextRequest) => {
	const body = await request.json()

	try {
		const validationResponse =  validate(body)

		if(validationResponse) return validationResponse

		const updatedResource = await resourceService.updateResource(body.id, body)

		return NextResponse.json({message: "Resource updated Successfully", data: updatedResource}, {status: 201})

	} catch(error) {
		console.log("Error", error);

		// format error
		const [body, status] = globalErrorFormatter(error as CustomError);

		return NextResponse.json(body, status);
	}
}

export const DELETE = async (request: NextRequest, {params}: {params: {id: number}}) => {
	if(!params.id) return NextResponse.json({message: "Resource ID parameter is missing", data: null}, {status: 404})

	try {
		// delete resource through service layer
		await resourceService.removeResources([params.id]);

		return NextResponse.json({ message: "Resource deleted", data: null }, { status: 200 });
	} catch (error) {
		console.log("Error", error);

		// format error
		const [body, status] = globalErrorFormatter(error as CustomError);

		return NextResponse.json(body, status);
	}
};

const validate = (body: any) => {
	const requiredFields = ["name", "icon", "user_id"];
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
