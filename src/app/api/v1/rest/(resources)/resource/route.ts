import { NextRequest, NextResponse } from "next/server";
import {
	createResourceTransaction,
	deleteResourceTransaction,
	findResource,
} from "@/services/resource-service";
import { auth } from "@/lib/auth";
import axios from "axios";
import config from "@/config";

type BodyParams = {
	userId: string; // TODO: Delete this field on production
	name: string;
	category: number | string;
	tags: number[] | string[];
	icon: string;
	thumbnail: string;
	description: string;
	url: string;
};
export async function POST(request: NextRequest): Promise<NextResponse> {
	const body: BodyParams = await request.json();
	const user = { id: body.userId };

	// const session = await auth.api.getSession({ headers: request.headers });
	// const user = session?.user;
	// if (!user)
	// 	return NextResponse.json(
	// 		{ message: "Unauthorized", data: null },
	// 		{ status: 403 },
	// 	);
	try {
		let resourceData;

		// if the request body has name, then it is manually created
		if (body.name) {
			const validationResponse = validate(body);
			if (validationResponse) return validationResponse;

			resourceData = body;
		}

		// check if the resource already exists
		const existingResource = await findResource({
			value: body.url,
			identifier: "url",
		});

		if (existingResource.length > 0) {
			return NextResponse.json(
				{ message: "Resource already exists", data: null },
				{ status: 400 },
			);
		}

		if (!body.name) {
			const response = await axios.get(
				`${config.SERVER_API_URL}/scrape?url=${body.url}`,
			);

			resourceData = {
				...response.data?.data,
				category: body.category,
				icon: response.data?.data.image,
				name:
					response.data?.data.title ?? response.data?.data.site_name,
				tags: [],
			};
		}
		console.log(resourceData);

		const { tags: tagParams } = resourceData;

		// check if the tags are string then it is new tags
		if (!Array.isArray(tagParams))
			return NextResponse.json(
				{ message: "Tags must be an array", data: null },
				{ status: 400 },
			);

		const newResource = await createResourceTransaction({
			...resourceData,
			userId: user.id,
		});

		return NextResponse.json(
			{ message: "Resource created", data: [newResource] },
			{ status: 201 },
		);
	} catch (error) {
		console.log("Error", error);

		return NextResponse.json(
			{ message: "Error creating resource", data: null },
			{ status: 400 },
		);
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: { id: number } },
): Promise<NextResponse> {
	const searchParams = request.nextUrl.searchParams;
	const type = searchParams.get("type") ?? "";
	const session = await auth.api.getSession({ headers: request.headers });
	const user = session?.user;
	if (!user)
		return NextResponse.json(
			{ message: "Unauthorized", data: null },
			{ status: 403 },
		);
	if (!params.id) {
		return NextResponse.json(
			{ message: "Resource ID parameter is missing", data: null },
			{ status: 404 },
		);
	}

	if (!["soft", "hard"].includes(type)) {
		return NextResponse.json(
			{ message: "Type parameter is missing", data: null },
			{ status: 404 },
		);
	}

	try {
		const deletedResources = await deleteResourceTransaction({
			ids: [params.id],
			userId: user.id,
			type: type as "soft" | "hard",
		});

		return NextResponse.json(
			{
				message: "Resource successfully retrieved",
				data: deletedResources,
			},
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

const validate = (body: BodyParams) => {
	const requiredFields = ["name", "icon", "category", "tags", "url"];
	const missingFields = requiredFields.filter(
		(field) => !body[field as keyof BodyParams],
	);

	if (missingFields.length > 0) {
		return NextResponse.json(
			{
				message: `Please fill in the ${missingFields.join(", ")} field(s)`,
				data: {
					path: missingFields,
				},
			},
			{ status: 400 },
		);
	}

	return null;
};
