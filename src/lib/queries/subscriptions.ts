import request from "@/config/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetSubscriptions = () => {
	return useQuery({
		queryKey: ["subscriptions"],
		queryFn: () => request({ url: "/subscriptions" }),
	});
};
