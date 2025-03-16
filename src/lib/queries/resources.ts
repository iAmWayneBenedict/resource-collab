import { useQuery } from "@tanstack/react-query";
import request from "@/config/axios";

export const useGetPaginatedResourcesQuery = (
	{ enabled, ...filters }: any,
	deps: (string | number)[] = [],
): any => {
	const searchParams = new URLSearchParams(filters);
	return useQuery({
		enabled,
		queryKey: ["paginated-resources", ...deps],
		queryFn: () =>
			request({ url: "/resources?" + searchParams.toString() }),
	});
};
