import { db } from "@/data/connection";
import {
	resourceAccess,
	resources,
	resourceShortUrlAccess,
} from "@/data/schema";
import { getSession } from "@/lib/auth";
import { and, eq, sql } from "drizzle-orm";
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
			const [result] = await tx.query.resourceShortUrlAccess.findMany({
				columns: { full_path: true, resource_id: true, emails: true },
				with: { user: { columns: { email: true } } },
				where: eq(resourceShortUrlAccess.short_code, p.short_code),
				limit: 1,
			});

			if (result.emails?.length) {
				if (!user) {
					// User not logged in but email access is required
					return { message: "Authentication required", status: 401 };
				}
				if (
					!result.emails.includes(user?.email!) &&
					result.user?.email !== user?.email
				) {
					// User is logged in but doesn't have access
					return { message: "Access denied", status: 403 };
				}
			}

			await tx
				.update(resources)
				.set({
					view_count: sql`${resources.view_count} + 1`,
				})
				.where(eq(resources.id, result.resource_id));

			return { redirect_url: result.full_path, status: 200 };
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
