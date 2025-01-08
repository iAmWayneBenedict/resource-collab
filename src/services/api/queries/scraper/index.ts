import { useQuery } from "@tanstack/react-query";
import ApiMethods from "@/services/api/ApiMethods";
import ENDPOINTS from "@/services/api/EndPoints";
import { queryParamsHandler } from "@/services/api/utils";

export const useWebScraperQuery = ({ data }: { data: string }) => {
	return useQuery({
		enabled: !!data,
		queryKey: ["web-scraper", data],
		queryFn: (): TResponseAPI<any> =>
			ApiMethods.get<any>(ENDPOINTS.SCRAPER(queryParamsHandler({ url: data }))),
		retry: 1,
	});
};
