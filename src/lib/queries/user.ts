import { useQuery } from "@tanstack/react-query";
import request from "@/config/axios";

export const useGetPaginatedUsersQuery = (filters: any): any => {
	const searchParams = new URLSearchParams(filters);
	return useQuery({
		queryKey: ["users"],
		queryFn: () => request({ url: "/users?" + searchParams.toString() }),
	});
};

export const useGetUserResourcesQuery = (
	filters: any,
	options: Record<string, any>,
): any => {
	const searchParams = new URLSearchParams(filters);
	return useQuery({
		enabled: !!options?.user_id,
		queryKey: [
			`user-${options.type}${options.id ? `-${options.id}` : ""}${options.tab ? "-" + options.tab : ""}`,
		],
		queryFn: () =>
			request({
				url: `/users/${options.user_id}/${options.type}${options.id ? "/" + options.id : ""}?${searchParams.toString()}`,
			}),
	});
};
