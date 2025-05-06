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
export const useGetPublicCollectionResourcesQuery = (
	{ enabled, params, ...filters }: any,
	deps: (string | number)[] = [],
): any => {
	const searchParams = new URLSearchParams(filters);
	return useQuery({
		enabled,
		queryKey: ["public-collection", ...deps],
		queryFn: () =>
			request({
				url:
					`/resource-collections/${params.id}/public?` +
					searchParams.toString(),
			}),
	});
};
