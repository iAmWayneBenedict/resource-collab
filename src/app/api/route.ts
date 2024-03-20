import { db } from "@/db/connection";
import { admins, portfolios, skills, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse, NextRequest } from "next/server";
import { portfolioToSkills } from "../../db/schema";

// To handle a GET request to /api
export async function GET(request: NextRequest, response: NextResponse) {
	// sample using relations
	return NextResponse.json(
		await db.query.portfolioToSkills.findMany({
			with: {
				portfolio: true,
				skill: true,
			},
		})
	);
	return NextResponse.json(
		await db
			.select()
			.from(portfolios)
			.innerJoin(portfolioToSkills, eq(portfolioToSkills.portfolio_id, portfolios.id))
			.innerJoin(skills, eq(portfolioToSkills.skill_id, skills.id))
			.where(eq(skills.id, 1))
	);
}

// To handle a POST request to /api
export async function POST(request: NextRequest, response: NextResponse) {
	// Do whatever you want
	return NextResponse.json({ message: "Hello World" });
}
