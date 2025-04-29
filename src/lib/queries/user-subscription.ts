import request from "@/config/axios";
import { useAuthUser } from "@/store";
import { useQuery } from "@tanstack/react-query";

export const useGetUserSubscriptionQuery = async () => {
	const user = useAuthUser.getState().authUser;
	return useQuery({
		queryKey: ["user-subscription"],
		queryFn: () => request({ url: `/users/${user?.id}/subscriptions` }),
	});
};
