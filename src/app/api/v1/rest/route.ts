import { NextResponse, NextRequest } from "next/server";
import { getResourceToCategoryByRelationalQuery } from "@/repositories/resource-to-category";

// To handle a GET request to /api
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

	return NextResponse.json({
		data:
			(await getResourceToCategoryByRelationalQuery(
				["category", "resource"],
				(schema, { and, eq }) => and(eq(schema.category_id, 1), eq(schema.resource_id, 6))
			)) || null,
	});
}

// To handle a POST request to /api
export async function POST(request: NextRequest, response: NextResponse) {
	// Do whatever you want
	return NextResponse.json({ message: "Hello World" });
}
