import { useQuery } from "@tanstack/react-query";
import ApiMethods from "@/services/ApiMethods";
import ENDPOINTS from "@/services/EndPoints";
import { queryParamsHandler } from "@/services/utils";

export const useWebScraperQuery = ({ data }: { data: string }) => {
    return useQuery({
        enabled: !!data,
        queryKey: ["web-scraper", data],
        queryFn: (): Promise<TSuccessAPIResponse<any> | TErrorAPIResponse> => ApiMethods.get<any>(ENDPOINTS.SCRAPER(queryParamsHandler({ url: data }))),
        retry: 1
    })
};