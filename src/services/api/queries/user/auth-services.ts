import { useQuery } from "@tanstack/react-query";
import request from "@/config/axios/axios-config";

export const useGetLoggedUserQuery = () => {
	return useQuery({
		queryKey: ["logged-user"],
		queryFn: (): TResponseAPI<any> => request({ url: "/auth/validate" }),
		retry: 1,
	});
};
