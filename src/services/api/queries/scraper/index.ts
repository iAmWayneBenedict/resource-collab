import { useQuery } from "@tanstack/react-query";
import { queryParamsHandler } from "@/services/api/utils";
import request from "@/config/axios";

export const useWebScraperQuery = ({ data }: { data: string }) => {
  return useQuery({
    enabled: !!data,
    queryKey: ["web-scraper", data],
    queryFn: (): TResponseAPI<any> =>
      request({ url: "/scrape" + queryParamsHandler({ url: data }) }),
    retry: 1,
  });
};
