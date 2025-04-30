import { subscriptions, userSubscriptions } from "@/data/schema";
import { and, eq, sql } from "drizzle-orm";
type UpdateSubscriptionCountLimitParams = {
	userId: string;
	limitCountName: SubscriptionLimitType;
	mode?: "increment" | "decrement";
	tx: any;
	count?: number;
};
const ERROR_MESSAGES = {
	ai_searches_per_day:
		"Daily AI searches limit exceeded. Please upgrade your plan to continue.",
	shared_users:
		"Shared users limit exceeded. Please upgrade your plan to continue.",
	collections:
		"Collections limit exceeded. Please upgrade your plan to continue.",
	ai_generated_categories_and_tags:
		"Monthly AI generated categories and tags limit exceeded. Please upgrade your plan to continue.",
};
const checkLimitExceeded = (
	currentCount: number,
	limitCount: number,
	limitCountName: SubscriptionLimitType,
) => {
	if (currentCount >= limitCount) {
		const error = new Error(ERROR_MESSAGES[limitCountName]);
		error.name = `${limitCountName.toUpperCase()}_LIMIT_EXCEEDED`.replace(
			/\s/g,
			"_",
		);
		throw error;
	}
};
const calculateTotalCount = (
	currentCount: number,
	count: number,
	limitCountName: string,
	mode: string, // 'increment' or 'decrement'
) => {
	if (limitCountName !== "shared_users") {
		return {
			totalCount: count,
			operator: mode === "increment" ? "+" : "-",
		};
	}

	let totalCount = currentCount - count;
	let operator = totalCount > 0 ? "-" : "+";
	totalCount = Math.abs(totalCount);
	console.log(totalCount, currentCount, count);
	return { totalCount, operator };
};
export const updateSubscriptionCountLimit = async ({
	userId,
	limitCountName,
	tx,
	mode = "increment",
	count = 1,
}: UpdateSubscriptionCountLimitParams) => {
	try {
		const [currentUserSubscriptionLimits] = await tx
			.select({
				limit_counts: userSubscriptions.limit_counts,
				subscription_id: userSubscriptions.subscription_id,
			})
			.from(userSubscriptions)
			.where(eq(userSubscriptions.user_id, userId));
		const currentCount =
			currentUserSubscriptionLimits.limit_counts[limitCountName];

		const { totalCount, operator } = calculateTotalCount(
			currentCount,
			count,
			limitCountName,
			mode,
		);

		const [subscription] = await tx
			.select({ limits: subscriptions.limits })
			.from(subscriptions)
			.where(
				and(
					eq(
						subscriptions.id,
						currentUserSubscriptionLimits.subscription_id,
					),
				),
			);
		const limitCount = subscription.limits[limitCountName];

		checkLimitExceeded(currentCount, limitCount, limitCountName);

		// Update both ai_searches_per_day and ai_searches if limitCountName is ai_searches_per_day
		if (limitCountName === "ai_searches_per_day" && mode === "increment") {
			const [userSubscription] = await tx
				.update(userSubscriptions)
				.set({
					limit_counts: sql`
						jsonb_set(
							jsonb_set(
								limit_counts, 
								ARRAY[${limitCountName}], 
								to_jsonb(
									(limit_counts->>${limitCountName})::int ${sql.raw(operator)} ${totalCount})
							),
							ARRAY['ai_searches'],
							to_jsonb(
								(limit_counts->>'ai_searches')::int ${sql.raw(operator)} ${totalCount})
						)`,
				})
				.where(eq(userSubscriptions.user_id, userId))
				.returning();

			return userSubscription;
		} else {
			// For other limitCountName types, use the original update logic
			const [userSubscription] = await tx
				.update(userSubscriptions)
				.set({
					limit_counts: sql`
						jsonb_set(
							limit_counts, 
							ARRAY[${limitCountName}], 
							to_jsonb(
								(limit_counts->>${limitCountName})::int ${sql.raw(operator)} ${totalCount})
							)`,
				})
				.where(eq(userSubscriptions.user_id, userId))
				.returning();

			return userSubscription;
		}
	} catch (err) {
		throw err;
	}
};

type HasSubscriptionAccessParams = {
	type: SubscriptionLimitType;
	user_id: string;
	dbContext: any;
};

export const hasSubscriptionAccess = async ({
	type,
	user_id,
	dbContext,
}: HasSubscriptionAccessParams) => {
	const userSubscription = await dbContext.query.userSubscriptions.findFirst({
		with: { subscription: true },
		where: eq(userSubscriptions.user_id, user_id),
	});

	const {
		subscription: { limits: subscriptionLimit },
		limit_counts: userLimitCounts,
	} = userSubscription;

	if (userLimitCounts[type] < subscriptionLimit[type]) return true;

	return false;
};
