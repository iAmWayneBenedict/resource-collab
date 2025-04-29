import request from "@/config/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetSharedCollections = (
	filters: any,
	options: Record<string, any>,
) => {
	return useQuery({
		queryKey: ["shared-collections"],
		queryFn: () => request({ url: "/resource-collections/shared" }),
	});
};
