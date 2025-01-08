import { useQuery } from "@tanstack/react-query";
import ApiMethods from "@/services/api/ApiMethods";
import ENDPOINTS from "@/services/api/EndPoints";

export const useGetLoggedUserQuery = () => {
	return useQuery({
		queryKey: ["logged-user"],
		queryFn: (): TResponseAPI<any> => ApiMethods.get<any>(ENDPOINTS.VERIFY_LOGGED_USER()),
		retry: 1,
	});
};
