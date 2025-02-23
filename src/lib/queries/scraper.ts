import { useQuery } from "@tanstack/react-query";
import request from "@/config/axios";

export const useWebScraperQuery = ({ data }: { data: string }) => {
	const searchParams = new URLSearchParams({ url: data });
	return useQuery({
		enabled: !!data,
		queryKey: ["web-scraper", data],
		queryFn: (): TResponseAPI<any> =>
			request({ url: "/scrape?" + searchParams.toString() }),
		retry: 1,
	});
};
