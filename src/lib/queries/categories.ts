import { useQuery } from "@tanstack/react-query";
import request from "@/config/axios";

export const useGetCategoriesQuery = (): any => {
	return useQuery({
		queryKey: ["categories"],
		queryFn: () => request({ url: "/categories" }),
	});
};
