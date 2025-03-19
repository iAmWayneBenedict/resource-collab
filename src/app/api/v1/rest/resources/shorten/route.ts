import { getSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { db } from "@/data/connection";
import { resourceAccess, resourceShortUrls } from "@/data/schema";
import config from "@/config";
import { and, eq, exists } from "drizzle-orm";

export const POST = async (req: NextRequest) => {
	const session = await getSession(req.headers);
	const user = session?.user;

	if (!user) {
		return NextResponse.json(
			{ message: "Unauthorized", data: null },
			{ status: 403 },
		);
	}

	try {
		const body = await req.json();

		const notValid = validate(body, [
			"full_path",
			"resource_id",
			"emails",
			"access_level",
			// "permission_level", //* No need for permission level for resources
		]);

		if (notValid) return notValid;

		const [id, shortCode] = await db.transaction(async (tx) => {
			const exist = await tx
				.select()
				.from(resourceShortUrls)
				.where(
					and(
						eq(resourceShortUrls.resource_id, body.resource_id),
						eq(resourceShortUrls.user_id, user.id),
					),
				);
			if (body?.id || exist.length) {
				const [{ short_code }] = await tx
					.select({ short_code: resourceShortUrls.short_code })
					.from(resourceShortUrls)
					.where(eq(resourceShortUrls.id, body.id ?? exist[0].id));

				const [{ id }] = await tx
					.update(resourceAccess)
					.set({ emails: body.emails })
					.returning({ id: resourceAccess.id });
				return [id, short_code];
			}

			const shortCode = nanoid(6);

			const [shortUrl] = await tx
				.insert(resourceShortUrls)
				.values({
					full_path: body.full_path,
					resource_id: body.resource_id,
					user_id: user.id,
					short_code: shortCode,
				})
				.returning({ id: resourceShortUrls.id });

			const [{ id }] = await tx
				.insert(resourceAccess)
				.values({
					resource_short_url_id: shortUrl.id,
					emails: body.emails,
				})
				.returning({ id: resourceAccess.id });
			return [id, shortCode];
		});

		return NextResponse.json(
			{
				message: "Success",
				data: { short_url: `${config.BASE_URL}/r/${shortCode}`, id },
			},
			{ status: 200 },
		);
	} catch (error: any) {
		console.log(error.message);
		return NextResponse.json(
			{ message: "Invalid request", data: null },
			{ status: 500 },
		);
	}
};

const validate = (body: any, requiredFields: string[]) => {
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
