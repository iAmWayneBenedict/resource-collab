import { NextRequest, NextResponse } from "next/server";
import { isValidUrl } from "@/lib/utils";
import ScraperService from "@/services/scraper";

const META_TAGS: string[] = [
	"url",
	"title",
	"site_name",
	"image",
	"description",
];
export const GET = async (request: NextRequest, response: NextResponse) => {
	// Parse the request URL
	let requestUrl: URL;
	try {
		requestUrl = new URL(request.url);
	} catch (e) {
		return NextResponse.json(
			{ message: "Invalid URL", data: null },
			{ status: 400 },
		);
	}

	const urlParam: string | null = requestUrl.searchParams.get("url");

	if (!urlParam || !isValidUrl(urlParam)) {
		return NextResponse.json(
			{ message: "Invalid URL", data: null },
			{ status: 400 },
		);
	}

	/*
	 * * NOTE: try first with cheerio for faster scraper.
	 * This cannot handle sites like TikTok
	 */
	console.log("Trying cheerio scraper");
	try {
		const scrapedData = await ScraperService.cheerio(urlParam, META_TAGS);

		return NextResponse.json(
			{ message: "Success scrapping URL", data: scrapedData },
			{ status: 200 },
		);
	} catch (e) {
		console.error(e);
	}

	/*
	 * NOTE: if cheerio fails, try puppeteer.
	 * But this approach is slower
	 * since it needs to open a browser and wait for the page to load
	 */
	console.log("Trying puppeteer scraper");
	try {
		const scrapedData = await ScraperService.puppeteer(urlParam, META_TAGS);

		return NextResponse.json(
			{ message: "Success scrapping URL", data: scrapedData },
			{ status: 200 },
		);
	} catch (e) {
		console.error(e);
		if (e instanceof Error) {
			return NextResponse.json(
				{ message: e.message, data: null },
				{ status: 400 },
			);
		}

		return NextResponse.json(
			{ message: "Error scrapping URL", data: null },
			{ status: 400 },
		);
	}
};
