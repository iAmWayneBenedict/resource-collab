import config from "@/config";
import { db } from "@/data/connection";
import { getSession } from "@/lib/auth";
import { AIService } from "@/services/ai";
import { ListOfSchema } from "@/services/ai/gemini";
import { ListOfPrompt } from "@/services/ai/prompts";
import { ListOfSystemInstruction } from "@/services/ai/system-instructions";
import { findResources } from "@/services/resource-service";
import { updateSubscriptionCountLimit } from "@/services/subscription-service";
import VectorService from "@/services/vector";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
	const query = req.nextUrl.searchParams.get("query");
	const session = await getSession(req.headers);
	const user = session?.user;

	if (!user)
		return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

	if (!query) {
		return NextResponse.json(
			{
				message: "Query is required",
				data: { path: ["query"] },
			},
			{ status: 400 },
		);
	}

	try {
		console.log("preparing vector search");
		const searchResult = await VectorService.pinecone.queryResources([
			query,
		]);
		console.log("done vector search");

		const filteredSearchResultCutOff = searchResult.matches
			.map((result) => ({
				score: result.score,
				metadata: result.metadata,
			}))
			.filter(
				(result) =>
					typeof result?.score === "number" &&
					result.score >= config.SCORE_CUTOFF,
			);

		console.log("preparing ai search");
		const {
			response: { summary, resources },
			usageMetaData, // TODO: add usage meta data to activity monitoring
		} = await AIService.gemini.generate({
			prompt: ListOfPrompt.LIST_OF_RESOURCES({
				query,
				resources: filteredSearchResultCutOff,
			}),
			config: ListOfSchema.LIST_OF_RESOURCES,
			systemInstruction:
				ListOfSystemInstruction.LIST_OF_RESOURCES_INSTRUCTION,
		});
		console.log(usageMetaData);
		console.log("done ai search");

		await updateSubscriptionCountLimit({
			userId: user.id,
			limitCountName: "ai_searches_per_day",
			count: 1,
			mode: "increment",
			tx: db,
		});

		// let resourcesData = null;
		// if (resources.length) {
		// 	resourcesData = await findResources({
		// 		page: 1,
		// 		limit: 10,
		// 		resourceIds: resources,
		// 		search: "",
		// 		sortBy: "",
		// 		sortType: null,
		// 		category: null,
		// 		tags: [],
		// 		userId: user?.id ?? undefined,
		// 	});
		// }

		// const rows = resourcesData?.rows ?? [];
		// const totalCount = resourcesData?.totalCount ?? 0;

		// // sort the rows by the order of the resources in the resources array
		// const rowsSorted = rows?.sort((a, b) => {
		// 	const indexA = resources.indexOf(a.id);
		// 	const indexB = resources.indexOf(b.id);
		// 	return indexA - indexB;
		// });

		return NextResponse.json(
			{
				message: "Success",
				data: { ids: resources, summary },
			},
			{ status: 200 },
		);
	} catch (e) {
		return NextResponse.json(
			{ message: "Error", data: e },
			{ status: 500 },
		);
	}
};
