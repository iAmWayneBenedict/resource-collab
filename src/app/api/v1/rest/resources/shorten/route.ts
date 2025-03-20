import { getSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { db } from "@/data/connection";
import { resourceAccess, resourceShortUrlAccess } from "@/data/schema";
import config from "@/config";
import { and, eq, isNull } from "drizzle-orm";

// Define types for request body
interface ShortenResourceRequest {
	full_path: string;
	resource_id: number;
	emails: string[];
	access_level: string;
	id?: string;
}

export const POST = async (req: NextRequest) => {
	const session = await getSession(req.headers);
	const user = session?.user;

	try {
		const body = (await req.json()) as ShortenResourceRequest;

		const validationError = validateRequestBody(body, [
			"full_path",
			"resource_id",
			"emails",
			"access_level",
		]);

		if (validationError) return validationError;

		const [accessId, shortCode] = await createOrUpdateShortUrl(
			body,
			user?.id,
		);

		return NextResponse.json(
			{
				message: "Success",
				data: {
					short_url: `${config.BASE_URL}/r/${shortCode}`,
					id: accessId,
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
): Promise<[number, string]> => {
	// this will create separate shorturls for public access and for users
	return db.transaction(async (tx) => {
		const filter = [
			eq(resourceShortUrlAccess.resource_id, requestData.resource_id),
		];

		if (!userId) filter.push(isNull(resourceShortUrlAccess.user_id));
		else filter.push(eq(resourceShortUrlAccess.user_id, userId));

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

			const [{ short_code, id }] = await tx
				.select({
					short_code: resourceShortUrlAccess.short_code,
					id: resourceShortUrlAccess.id,
				})
				.from(resourceShortUrlAccess)
				.where(eq(resourceShortUrlAccess.id, shortUrlId));

			return [id, short_code];
		}

		// Create new short URL
		const shortCode = nanoid(6);

		const [{ id }] = await tx
			.insert(resourceShortUrlAccess)
			.values({
				full_path: requestData.full_path,
				resource_id: requestData.resource_id,
				user_id: userId,
				short_code: shortCode,
				emails: requestData.emails,
			})
			.returning({ id: resourceShortUrlAccess.id });

		return [id, shortCode];
	});
};
