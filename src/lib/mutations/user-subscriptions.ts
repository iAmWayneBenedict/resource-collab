import { useAuthUser } from "@/store";
import { useHookMutation } from "./mutation-hook";

export const usePostUserSubscriptionMutation = ({ ...options }) => {
	const user = useAuthUser.getState().authUser;
	return useHookMutation({
		endpoint: `/users/${user?.id}/subscription`,
		...options,
	});
};
