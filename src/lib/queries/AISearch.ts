import { useQuery } from "@tanstack/react-query";
import request from "@/config/axios";

export const useGetAISearchQuery = ({ ...params }): any => {
	return useQuery({
		queryKey: ["ai-search"],
		queryFn: () => request({ url: "/ai/search?query=" + params.query }),
		staleTime: 0, // Results become stale immediately
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		refetchOnReconnect: false,
		...params,
	});
};
