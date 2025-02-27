import { db } from "@/data/connection";
import { resourceTags, tags } from "@/data/schema";
import { eq, inArray } from "drizzle-orm";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest, response: NextResponse) {
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
				resourceTags: {
					with: {
						tag: true,
					},
					// where: (resourceTags, { inArray }) =>
					// 	inArray(resourceTags.tag_id, [338]),
				},
			},
			where: (resources, { exists, and, eq }) =>
				exists(
					db
						.select()
						.from(resourceTags)
						.where(
							and(
								eq(resourceTags.resource_id, resources.id),
								inArray(resourceTags.tag_id, [338]),
							),
						),
				),
		}),
	});

	return NextResponse.json({
		data: await db.query.resourceTags.findMany({
			with: {
				tag: true,
			},
			where: eq(resourceTags.resource_id, 56),
		}),
	});
}

// To handle a POST request to /api
export async function POST(request: NextRequest, response: NextResponse) {
	// Do whatever you want
	return NextResponse.json({ message: "Hello World" });
}
