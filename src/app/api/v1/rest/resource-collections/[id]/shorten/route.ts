import { getSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { db } from "@/data/connection";
import { collectionFolders, collectionShortUrls } from "@/data/schema";
import config from "@/config";
import { and, eq, InferSelectModel, isNull } from "drizzle-orm";
import { updateSubscriptionCountLimit } from "@/services/subscription-service";
import { uniqueSharedEmails } from "@/services/short-url-service";

export const GET = async (
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
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
				.select({
					collection_short_urls: collectionShortUrls,
					collection_folders: {
						name: collectionFolders.name,
						access_level: collectionFolders.access_level,
						shared_to: collectionFolders.shared_to,
					},
				})
				.from(collectionShortUrls)
				.where(
					and(
						eq(collectionShortUrls.collection_folder_id, id),
						eq(collectionShortUrls.user_id, user.id),
					),
				)
				.leftJoin(
					collectionFolders,
					eq(
						collectionFolders.id,
						collectionShortUrls.collection_folder_id,
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
	shared_to: Record<string, string>[];
	access_level: "public" | "private" | "shared";
	collection_folder_id?: string;
	id?: string;
}

export const POST = async (
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
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
		const body = (await req.json()) as ShortenResourceRequest;

		const validationError = validateRequestBody(body, [
			"shared_to",
			"access_level",
		]);

		if (validationError) return validationError;

		const shortUrl = await createOrUpdateShortUrl(
			{ ...body, collection_folder_id: id },
			user.id,
		);

		return NextResponse.json(
			{
				message: "Success",
				data: {
					...shortUrl,
					short_url: `${config.BASE_URL}/c/${shortUrl.short_code}`,
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
	userId: string,
): Promise<InferSelectModel<typeof collectionShortUrls>> => {
	// this will create separate shorturls for public access and for users
	return db.transaction(async (tx) => {
		const filter = [
			eq(
				collectionShortUrls.collection_folder_id,
				requestData.collection_folder_id as string,
			),
			eq(collectionShortUrls.user_id, userId),
		];

		// Check if short URL already exists for this resource and user
		const existingShortUrls = await tx
			.select()
			.from(collectionShortUrls)
			.where(and(...filter));

		const shortUrlExists = requestData?.id || existingShortUrls.length > 0;

		// Update existing short URL
		if (shortUrlExists) {
			const [{ name }] = await tx
				.update(collectionFolders)
				.set({
					shared_to: requestData.shared_to,
					access_level: requestData.access_level,
				})
				.where(
					eq(
						collectionFolders.id,
						requestData.collection_folder_id as string,
					),
				)
				.returning({ name: collectionFolders.name });

			const uniqueSharedUsers = await uniqueSharedEmails(userId, tx);
			await updateSubscriptionCountLimit({
				userId: userId,
				limitCountName: "shared_users",
				mode: "increment",
				tx,
				count: uniqueSharedUsers.length,
			});

			const resultShortUrl = {
				...existingShortUrls[0],
				name,
				access_level: requestData.access_level,
				shared_to: requestData.shared_to,
			};

			return resultShortUrl;
		}

		// Create new short URL
		const shortCode = nanoid(6);

		await tx.update(collectionFolders).set({
			access_level: requestData.access_level,
			shared_to: requestData.shared_to,
		});

		const [shortUrl] = await tx
			.insert(collectionShortUrls)
			.values({
				user_id: userId,
				collection_folder_id:
					requestData.collection_folder_id as string,
				short_code: shortCode,
			})
			.returning();

		const uniqueSharedUsers = await uniqueSharedEmails(userId, tx);
		await updateSubscriptionCountLimit({
			userId: userId,
			limitCountName: "shared_users",
			mode: "increment",
			tx,
			count: uniqueSharedUsers.length,
		});

		const resultShortUrl = {
			...shortUrl,
			access_level: requestData.access_level,
			shared_to: requestData.shared_to,
		};

		return resultShortUrl;
	});
};
