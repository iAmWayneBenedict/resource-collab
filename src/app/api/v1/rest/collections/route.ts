import { db } from "@/data/connection";
import { collectionFolders, resourceCollections } from "@/data/schema";
import { getSession } from "@/lib/auth";
import { createCollection } from "@/services/collection-service";
import { count, eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
	const body = await req.json();

	const notValid = validate(body);
	if (notValid) return notValid;

	const session = await getSession(req.headers);
	const user = session?.user;

	if (!body) {
		return NextResponse.json(
			{ message: "No body in the request", data: null },
			{ status: 400 },
		);
	}

	if (!user) {
		return NextResponse.json(
			{ message: "Unauthorized", data: null },
			{ status: 401 },
		);
	}

	try {
		await createCollection({
			type: "resource",
			userId: user.id,
			name: body.name,
			resourceId: body.resource_id,
		});

		return NextResponse.json(
			{
				message: "Successfully saved resource",
				data: null,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.log(error);
		return NextResponse.json(
			{ message: "Something went wrong", data: null },
			{ status: 500 },
		);
	}
};

type BodyParams = {
	name: string;
	resource_id: string;
};
const validate = (body: BodyParams) => {
	const requiredFields = ["name", "resource_id"];
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

export const GET = async (req: NextRequest) => {
	const session = await getSession(req.headers);
	const user = session?.user;
	if (!user) {
		return NextResponse.json(
			{ message: "Unauthorized", data: null },
			{ status: 401 },
		);
	}

	try {
		const collectionsData = await db.query.collectionFolders.findMany({
			extras: {
				resourceCount: sql<{
					resourceCount: number;
				}>`CAST((SELECT COUNT(*) as resourceCount FROM resource_collections WHERE collection_folder_id = ${collectionFolders.id}) AS integer)`.as(
					"resourceCount",
				),
			},
			where: eq(collectionFolders.user_id, user.id),
		});

		return NextResponse.json(
			{
				message: "Successfully retrieved collections",
				data: collectionsData,
			},
			{ status: 200 },
		);
	} catch (error) {
		console.log(error);

		return NextResponse.json(
			{ message: "Something went wrong", data: null },
			{ status: 500 },
		);
	}
};
