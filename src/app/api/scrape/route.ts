import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from "cheerio";
import axios from "axios";
import { isValidUrl } from "@/lib/utils";

export const GET = async (request: NextRequest, response: NextResponse) => {
    // Parse the request URL
    let requestUrl: URL;
    try {
        requestUrl = new URL(request.url);
    } catch (e) {
        return NextResponse.json({ message: "Invalid URL", data: null }, { status: 400 });
    }

    // Get the 'url' query parameter
    const urlParam = requestUrl.searchParams.get('url');
    if (!urlParam || !isValidUrl(urlParam)) {
        return NextResponse.json({ message: "Invalid URL", data: null }, { status: 400 });
    }
    
    try {
        const res = await axios.get(urlParam as string);
        const html = res.data;
        const $ = cheerio.load(html);
        
        // Extract Open Graph meta tags
        const OG_TAGS = ['url', 'title', 'site_name', 'image', 'description']
        const metaTags = OG_TAGS.reduce((acc, tag) => {
            const content = $(`meta[property='og:${tag}']`).attr("content");
            if (content) acc[tag] = content;
            return acc;
        }, {} as Record<string, string | undefined>);

        if (Object.keys(metaTags).length) {
            return NextResponse.json({ message: "Success scrapping URL", data: metaTags }, { status: 200 });
        }
        
        return NextResponse.json({ message: "No meta tags found", data: null }, { status: 400 });
    } catch (error) {
        console.error("Error fetching URL:", error);
        
        return NextResponse.json({ message: "Error fetching URL", data: null }, { status: 500 });
    }
};