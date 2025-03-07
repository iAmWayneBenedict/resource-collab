import { useQuery, UseQueryResult } from "@tanstack/react-query";
import request from "@/config/axios";
import { AxiosResponse } from "axios";

export const useDeleteLikeResourceQuery = ({
	...options
}): UseQueryResult<AxiosResponse<any, any>, Error> => {
	return useQuery({
		queryKey: ["collections"],
		queryFn: () =>
			request({ method: "DELETE", url: `/likes/${options.param}` }),
		...options,
	});
};
