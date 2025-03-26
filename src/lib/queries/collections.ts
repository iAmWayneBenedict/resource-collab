import { useQuery, UseQueryResult } from "@tanstack/react-query";
import request from "@/config/axios";
import { AxiosResponse } from "axios";

export const useGetCollectionsQuery = ({
	hasCollections = false,
	enabled = true,
	...options
}: {
	hasCollections?: boolean;
	enabled?: boolean;
}): UseQueryResult<AxiosResponse<any, any>, Error> => {
	return useQuery({
		enabled,
		queryKey: ["collections"],
		queryFn: () => request({ url: `/resource-collections` }),
		...options,
	});
};
