import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";
import axios from "axios";
import { isValidUrl } from "@/lib/utils";
import { hasProfanity } from "@/app/api/scrape/_lib/utils";

type TMetaTags = Record<string, string | undefined>;

export const GET = async (request: NextRequest, response: NextResponse) => {
	// Parse the request URL
	let requestUrl: URL;
	try {
		requestUrl = new URL(request.url);
	} catch (e) {
		return NextResponse.json({ message: "Invalid URL", data: null }, { status: 400 });
	}

	// Get the 'url' query parameter
	const urlParam: string | null = requestUrl.searchParams.get("url");

	// If no URL parameter or invalid URL, return an error
	if (!urlParam || !isValidUrl(urlParam)) {
		return NextResponse.json({ message: "Invalid URL", data: null }, { status: 400 });
	}

	try {
		const res = await axios.get(urlParam as string);

		const html = res.data;
		const $ = cheerio.load(html);
		const scrapedContent = ($("meta[property='og:description']").attr("content") ||
			$("meta[name='description']").attr("content"))!;
		const profanityDetected = await hasProfanity(scrapedContent);

		// If profanity is detected, return an error
		if (profanityDetected) {
			return NextResponse.json(
				{ message: "Profanity detected", data: null },
				{ status: 400 }
			);
		}

		// Extract Open Graph meta tags
		const OG_TAGS: string[] = ["url", "title", "site_name", "image", "description"];
		const metaTags: TMetaTags = OG_TAGS.reduce((acc: TMetaTags, tag: string) => {
			const content: string | undefined = $(`meta[property='og:${tag}']`).attr("content");
			if (content) acc[tag] = content;
			return acc;
		}, {} as TMetaTags);

		// If has meta tags, return them
		if (Object.keys(metaTags).length) {
			return NextResponse.json(
				{ message: "Success scrapping URL", data: metaTags },
				{ status: 200 }
			);
		}

		// If no meta tags, return an error
		return NextResponse.json({ message: "No meta tags found", data: null }, { status: 404 });
	} catch (error: any) {
		console.error("Error fetching URL:", error.message);

		// Return an error response
		return NextResponse.json({ message: "Error fetching URL", data: null }, { status: 500 });
	}
};
