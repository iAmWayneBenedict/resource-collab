import { useQuery } from "@tanstack/react-query";
import ApiMethods from "../../ApiMethods";
import ENDPOINTS from "../../EndPoints";

export const useGetPaginatedUsersQuery = (filters: any): any => {
	const searchParams = new URLSearchParams(filters);
	return useQuery({
		queryKey: ["users"],
		queryFn: () => ApiMethods.get(ENDPOINTS.USERS("?" + searchParams.toString())),
	});
};
