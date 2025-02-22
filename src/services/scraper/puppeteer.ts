import puppeteer from "puppeteer";

const DEFAULT_TIMEOUT = 60000; // 60 sec
export const Puppeteer = async (url: string, META_TAGS: string[]) => {
	try {
		// initialize browser and page to be scraped
		const browser = await puppeteer.launch({ headless: "shell" });
		const page = await browser.newPage();

		page.setDefaultTimeout(DEFAULT_TIMEOUT);

		await page.goto(url);

		// wait for the page to load
		await page.waitForNetworkIdle();

		// get the home url of the selected url
		const protocol = new URL(url).protocol;
		const domain = new URL(url).hostname;
		const homeUrl = `${protocol}//${domain}`;

		// scrape the meta tags
		const scrapedData: MetaTagTypes = {};
		for (const tag of META_TAGS) {
			// use evaluate to get the content of the meta tag
			const content = await page.evaluate(
				(tag) =>
					document
						.querySelector(`meta[property='og:${tag}']`)
						?.getAttribute("content") ??
					document
						.querySelector(`meta[name='${tag}']`)
						?.getAttribute("content"),
				tag,
			);

			if (content) scrapedData[tag] = content;
			if (!content && tag === "title")
				scrapedData[tag] = await page.evaluate(() => document.title);
			if (tag === "icon") {
				const image = await page.evaluate(() => {
					return (
						document
							.querySelector("link[rel='shortcut icon']")
							?.getAttribute("href") ??
						document
							.querySelector("link[rel='icon']")
							?.getAttribute("href")
					);
				});

				// if the image is not a full url, add the home url
				if (!image?.includes("http") && image)
					scrapedData[tag] = homeUrl + image;
				else if (image) scrapedData[tag] = image;
				else scrapedData[tag] = "";

				scrapedData["thumbnail"] = content!;
			}
			if (tag === "url") scrapedData[tag] = url;
		}
		// close the browser
		await browser.close();

		if (!scrapedData) throw new Error("No Meta Tags");

		return scrapedData;
	} catch (e) {
		console.log(e);
		throw e;
	}
};
