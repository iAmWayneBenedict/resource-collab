import config from "@/config";
import { db } from "@/data/connection";
import { resourceCollections } from "@/data/schema";
import { AIService } from "@/services/ai";
import { ListOfSchema } from "@/services/ai/gemini";
import { ListOfPrompt } from "@/services/ai/prompts";
import { ListOfSystemInstruction } from "@/services/ai/system-instructions";
import { findResources } from "@/services/resource-service";
import VectorService from "@/services/vector";
import pinecone from "@/services/vector/pinecone";
import { eq } from "drizzle-orm";
import { index } from "drizzle-orm/mysql-core";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
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
	const query = req.nextUrl.searchParams.get("query") ?? "";
	console.log("preparing vector search");
	console.time("vector search");
	const r = await VectorService.pinecone.queryResources([query]);
	console.timeEnd("vector search");
	console.log("vector search done");
	console.log("preparing ai search");
	console.time("gen ai search");
	const SCORE_CUTOFF = 0.78;
	const f = r.matches
		.map((a) => ({
			score: a.score,
			metadata: a.metadata,
		}))
		.filter((a) => typeof a?.score === "number" && a.score >= SCORE_CUTOFF);

	const res = await AIService.gemini.generate({
		prompt: ListOfPrompt.LIST_OF_RESOURCES({
			query,
			resources: f,
		}),
		config: ListOfSchema.LIST_OF_RESOURCES,
		systemInstruction:
			ListOfSystemInstruction.LIST_OF_RESOURCES_INSTRUCTION,
	});
	console.log("ai search done");
	console.timeEnd("gen ai search");
	return NextResponse.json({
		data: {
			vector: r,
			filtered_vector: f,
			ai: res,
		},
	});
}

// To handle a POST request to /api
export async function POST() {
	const resources = await findResources({
		page: 1,
		limit: -1,
		search: "",
		sortBy: "created_at",
		sortType: "descending",
		category: "",
		tags: [],
		userId: undefined,
	});

	await VectorService.pinecone.upsertResource(resources.rows);

	return NextResponse.json({ message: "Hello World", data: resources });
}
