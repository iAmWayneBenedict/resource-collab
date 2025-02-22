import { AIService } from "@/services/ai";
import { ListOfSchema, ListOfSystemInstruction } from "@/services/ai/gemini";
import { GenerationConfig } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
	const prompt = req.nextUrl.searchParams.get("prompt");

	if (!prompt) {
		return NextResponse.json(
			{ message: "No prompt in the request", data: null },
			{ status: 400 },
		);
	}

	const configSchema = ListOfSchema.LIST_OF_RESOURCES;
	const systemInstruction = ListOfSystemInstruction.LIST_OF_RESOURCES_SUMMARY;

	const res = await AIService.gemini.generate({
		prompt,
		config: configSchema,
		systemInstruction,
	});

	return NextResponse.json({ message: "Success", data: res });
};
