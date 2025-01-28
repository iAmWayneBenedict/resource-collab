import { useQuery } from "@tanstack/react-query";
import ApiMethods from "../../ApiMethods";
import ENDPOINTS from "../../EndPoints";

export const useGetPaginatedResourcesQuery = (filters: any): any => {
	const searchParams = new URLSearchParams(filters);
	return useQuery({
		queryKey: ["paginated-resources"],
		queryFn: () => ApiMethods.get(ENDPOINTS.RESOURCES("?" + searchParams.toString())),
	});
};
