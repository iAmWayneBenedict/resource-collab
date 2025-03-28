import config from "@/config";
import { db } from "@/data/connection";
import { collectionFolders, collectionShortUrls } from "@/data/schema";
import { getSession } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const GET = async (
	_: any,
	{ params }: { params: Promise<{ short_code: string }> },
) => {
	const session = await getSession();
	const user = session?.user;

	const p = await params;

	if (!p.short_code)
		return NextResponse.json({ error: "short_code is required" });

	try {
		const response = await db.transaction(async (tx) => {
			const [result] = await tx.query.collectionShortUrls.findMany({
				columns: { collection_folder_id: true, user_id: true },
				with: {
					user: { columns: { email: true } },
					collectionFolder: true,
				},
				where: eq(collectionShortUrls.short_code, p.short_code),
				limit: 1,
			});
			const shared_to = result.collectionFolder.shared_to as Record<
				string,
				string
			>[];

			if (result.collectionFolder.access_level !== "public") {
				if (!shared_to.length)
					return { message: "Access denied", status: 403 };
				if (!user) {
					// User not logged in but email access is required
					return { message: "Authentication required", status: 401 };
				}

				if (user?.id === result.user_id) {
					return {
						redirect_url: `${config.BASE_URL}/dashboard/collections/${result.collectionFolder.id}?tab=resources`,
						status: 200,
					};
				}

				const hasAccess = shared_to.find(
					(shared_user) => shared_user.email === user?.email,
				);
				if (!hasAccess) {
					// User is logged in but doesn't have access
					return { message: "Access denied", status: 403 };
				} else {
					return {
						redirect_url: `${config.BASE_URL}/dashboard/shared/${result.collectionFolder.id}`,
						status: 200,
					};
				}
			} else {
				return {
					redirect_url: `${config.BASE_URL}/dashboard/shared/${result.collectionFolder.id}`,
					status: 200,
				};
			}
		});

		if (response.status !== 200)
			return NextResponse.json(
				{ message: response.message },
				{ status: response.status },
			);

		return NextResponse.json(
			{
				data: { redirect_url: response.redirect_url },
				message: "Success",
			},
			{ status: 200 },
		);
	} catch (err) {
		console.log(err);
		return NextResponse.json(
			{ message: "short_code not found" },
			{ status: 500 },
		);
	}
};
