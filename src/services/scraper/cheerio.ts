import { hasProfanity } from "@/app/api/v1/rest/scrape/_lib/utils";
import axios from "axios";
import * as cheerio from "cheerio";

export const Cheerio = async (url: string, META_TAGS: string[]) => {
	const domain = new URL(url).hostname;
	const protocol = new URL(url).protocol;
	const homeUrl = `${protocol}//${domain}`;

	try {
		const res = await axios.get(url);

		const html = res.data;
		const $ = cheerio.load(html);
		const scrapedContent = ($("meta[property='og:description']").attr(
			"content",
		) ?? $("meta[name='description']").attr("content"))!;
		if (!scrapedContent) {
			throw new Error("No description found");
		}

		// If profanity is detected, return an error
		const profanityDetected = await hasProfanity(scrapedContent);
		if (profanityDetected) {
			throw new Error("Profanity detected");
		}

		const metaTags: MetaTagTypes = META_TAGS.reduce(
			(acc: MetaTagTypes, tag: string) => {
				const content: string | undefined =
					$(`meta[property='og:${tag}']`).attr("content") ??
					$(`meta[name='${tag}']`).attr("content");

				if (content) acc[tag] = content;
				if (!content && tag === "title")
					acc[tag] = $("head title").text();
				if (tag === "icon") {
					const iconUrl =
						$("link[rel='shortcut icon']").attr("href") ??
						$("link[rel='icon']").attr("href");

					// If the image is not a full url, add the home url
					if (!iconUrl?.includes("http") && iconUrl)
						acc[tag] = homeUrl + iconUrl;
					else if (iconUrl) acc[tag] = iconUrl;
					else acc[tag] = "";

					acc["thumbnail"] = content;
				}

				if (tag === "url") acc[tag] = url;

				return acc;
			},
			{} as MetaTagTypes,
		);

		return metaTags;
	} catch (error: any) {
		console.log(error);
		console.log("Error", error.message);
		throw error;
	}
};
