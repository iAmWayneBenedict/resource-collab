import { db } from "@/data/connection";
import { resourceCollections } from "@/data/schema";
import { eq } from "drizzle-orm";
import { NextResponse, NextRequest } from "next/server";

export async function GET() {
	// sample using relations
	// return NextResponse.json(
	// 	await db.query.portfolioToSkills.findMany({
	// 		with: {
	// 			portfolio: true,
	// 			skill: true,
	// 		},
	// 	})
	// );
	// return NextResponse.json(
	// 	await db
	// 		.select()
	// 		.from(portfolios)
	// 		.innerJoin(portfolioToSkills, eq(portfolioToSkills.portfolio_id, portfolios.id))
	// 		.innerJoin(skills, eq(portfolioToSkills.skill_id, skills.id))
	// 		.where(eq(skills.id, 1))
	// );

	// return NextResponse.json({
	// 	data: await db
	// 		.select()
	// 		.from(resourceTags)
	// 		.leftJoin(tags, eq(resourceTags.tag_id, tags.id))
	// 		.where(eq(resourceTags.resource_id, 56)),
	// });
	// return NextResponse.json({
	// 	data: await db.query.tags.findMany({
	// 		with: {
	// 			resourceTags: {
	// 				where: (resourceTags, { eq }) =>
	// 					eq(resourceTags.resource_id, 56),
	// 			},
	// 		},
	// 		// where: inArray(tags.name, ["Networking"]),
	// 	}),
	// });

	return NextResponse.json({
		data: await db.query.resources.findMany({
			with: {
				resourceCollections: {
					where: eq(
						resourceCollections.user_id,
						"gaduDMR7AviJrbLuyXtxFl9aTqQSRitX",
					),
				},
			},
		}),
	});
}

// To handle a POST request to /api
export async function POST() {
	// Do whatever you want
	return NextResponse.json({ message: "Hello World" });
}
