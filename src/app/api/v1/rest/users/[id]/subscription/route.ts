import { db } from "@/data/connection";
import { subscriptions, users, userSubscriptions } from "@/data/schema";
import { getSession } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
	const session = await getSession(req.headers);
	const user = session?.user;

	if (!user)
		return NextResponse.json(
			{ message: "Unauthorized", data: null },
			{ status: 401 },
		);

	try {
		const subscription = await db.query.userSubscriptions.findFirst({
			where: eq(userSubscriptions.user_id, user.id),
		});

		return NextResponse.json(
			{ message: "Success", data: subscription },
			{ status: 200 },
		);
	} catch (err: any) {
		if (err instanceof Error) {
			return NextResponse.json(
				{ message: err.message, data: null },
				{ status: 500 },
			);
		}
		return NextResponse.json(
			{ message: "Server error", data: null },
			{ status: 500 },
		);
	}
};

export const POST = async (req: NextRequest) => {
	const session = await getSession(req.headers);
	const user = session?.user;

	const body = await req.json();

	if (!user)
		return NextResponse.json(
			{ message: "Unauthorized", data: null },
			{ status: 401 },
		);

	if (!body.selectedPlan)
		return NextResponse.json(
			{
				message: "Subscription field is required",
				data: { path: ["selectedPlan"] },
			},
			{ status: 400 },
		);

	try {
		await db.transaction(async (tx) => {
			const [subscription] = await tx
				.select()
				.from(subscriptions)
				.where(eq(subscriptions.type, body.selectedPlan));
			await tx.insert(userSubscriptions).values({
				user_id: user.id,
				subscription_id: subscription.id,
				billing_type: body.billingType,
			});

			await tx.update(users).set({
				affiliation: body.affiliation,
				profession: body.selectedProfessions,
				custom_profession: body.customProfession,
				news_letter: body.newsletter,
			});
		});

		return NextResponse.json(
			{ message: "Success", data: null },
			{ status: 200 },
		);
	} catch (err) {
		if (err instanceof Error)
			return NextResponse.json(
				{ message: err.message, data: null },
				{ status: 500 },
			);
		return NextResponse.json(
			{ message: "Server error", data: null },
			{ status: 500 },
		);
	}
};
export const PUT = async (req: NextRequest) => {
	const session = await getSession(req.headers);
	const user = session?.user;

	const body = await req.json();

	if (!user)
		return NextResponse.json(
			{ message: "Unauthorized", data: null },
			{ status: 401 },
		);

	if (!body.subscription)
		return NextResponse.json(
			{
				message: "Subscription field is required",
				data: { path: ["subscription"] },
			},
			{ status: 400 },
		);

	try {
		// await db.transaction(async (tx) => {
		// 	const [subscription] = await tx
		// 		.select()
		// 		.from(subscriptions)
		// 		.where(eq(subscriptions.type, body.subscription));
		// 	// await tx
		// 	// 	.update(userSubscriptions)
		// 	// 	.set({
		// 	// 		is_trial: false,
		// 	// 		is_lifetime: false,
		// 	// 		limit_counts: defaultSubscriptionLimitCounter,
		// 	// 	})
		// 	// 	.where(eq(userSubscriptions.user_id, user.id));
		// });

		// await updateSubscriptionCountLimit({
		// 	userId: user.id,
		// 	limitCountName: "collections",
		// 	mode: "increment",
		// 	tx: db,
		// });

		return NextResponse.json(
			{ message: "Success", data: null },
			{ status: 200 },
		);
	} catch (err) {
		if (err instanceof Error)
			return NextResponse.json(
				{ message: err.message, data: null },
				{ status: 500 },
			);
		return NextResponse.json(
			{ message: "Server error", data: null },
			{ status: 500 },
		);
	}
};
