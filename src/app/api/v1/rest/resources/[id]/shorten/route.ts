import { getSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { db } from "@/data/connection";
import { resourceShortUrlAccess } from "@/data/schema";
import config from "@/config";
import { and, eq, isNull } from "drizzle-orm";

export const GET = async (
	req: NextRequest,
	{ params }: { params: Promise<{ id: number }> },
) => {
	const session = await getSession(req.headers);
	const user = session?.user;

	if (!user) {
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
	}
	const { id } = await params;
	if (!id) {
		return NextResponse.json({ message: "Bad Request" }, { status: 400 });
	}

	try {
		const [shortUrl] = await db.transaction(async (tx) => {
			const exist = await tx
				.select()
				.from(resourceShortUrlAccess)
				.where(
					and(
						eq(resourceShortUrlAccess.resource_id, id as number),
						eq(resourceShortUrlAccess.user_id, user.id),
					),
				);

			if (!exist.length) throw new Error("Short url does not exist");

			return exist;
		});

		return NextResponse.json(
			{ message: "Successfully retrieved short url!", data: shortUrl },
			{ status: 200 },
		);
	} catch (err) {
		console.log(err);

		if (err instanceof Error)
			return NextResponse.json(
				{ message: err.message, data: null },
				{ status: 404 },
			);

		return NextResponse.json({ message: "Server error" }, { status: 500 });
	}
};

// Define types for request body
interface ShortenResourceRequest {
	full_path: string;
	resource_id: number;
	emails: string[];
	access_level: string;
	id?: string;
}

export const POST = async (
	req: NextRequest,
	{ params }: { params: Promise<{ id: number }> },
) => {
	const session = await getSession(req.headers);
	const user = session?.user;

	const { id } = await params;
	if (!id) {
		return NextResponse.json({ message: "Bad Request" }, { status: 400 });
	}

	try {
		const body = (await req.json()) as ShortenResourceRequest;

		const validationError = validateRequestBody(body, [
			"full_path",
			"access_level",
		]);

		if (validationError) return validationError;

		const shortUrl = await createOrUpdateShortUrl(
			{ ...body, resource_id: id },
			user?.id,
		);

		return NextResponse.json(
			{
				message: "Success",
				data: {
					...shortUrl,
					short_url: `${config.BASE_URL}/r/${shortUrl.short_code}`,
				},
			},
			{ status: 200 },
		);
	} catch (error: any) {
		console.error("Error creating short URL:", error.message);
		return NextResponse.json(
			{ message: "Server error", data: null },
			{ status: 500 },
		);
	}
};

/**
 * Validates the request body against required fields
 */
const validateRequestBody = (body: any, requiredFields: string[]) => {
	const missingFields = requiredFields.filter((field) => !body[field]);

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

/**
 * Creates a new short URL or updates an existing one
 */
const createOrUpdateShortUrl = async (
	requestData: ShortenResourceRequest,
	userId: string | undefined,
) => {
	// this will create separate shorturls for public access and for users
	return db.transaction(async (tx) => {
		const filter = [
			eq(resourceShortUrlAccess.resource_id, requestData.resource_id),
		];

		if (userId) filter.push(eq(resourceShortUrlAccess.user_id, userId));
		else filter.push(isNull(resourceShortUrlAccess.user_id));

		// Check if short URL already exists for this resource and user
		const existingShortUrls = await tx
			.select()
			.from(resourceShortUrlAccess)
			.where(and(...filter));

		const shortUrlExists = requestData?.id || existingShortUrls.length > 0;

		// Update existing short URL
		if (shortUrlExists) {
			const shortUrlId = (requestData.id ??
				existingShortUrls[0].id) as number;

			const [shortUrl] = await tx
				.update(resourceShortUrlAccess)
				.set({
					user_id: userId,
					emails: requestData.emails,
					access_level: requestData.access_level,
				})
				.where(eq(resourceShortUrlAccess.id, shortUrlId))
				.returning();

			return shortUrl;
		}

		// Create new short URL
		const shortCode = nanoid(6);

		const [shortUrl] = await tx
			.insert(resourceShortUrlAccess)
			.values({
				full_path: requestData.full_path,
				resource_id: requestData.resource_id,
				user_id: requestData.access_level === "public" ? null : userId,
				short_code: shortCode,
				emails: requestData.emails,
				access_level: requestData.access_level,
			})
			.returning();

		return shortUrl;
	});
};
