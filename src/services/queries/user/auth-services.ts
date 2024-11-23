import { useQuery } from "@tanstack/react-query";
import ApiMethods from "@/services/ApiMethods";
import ENDPOINTS from "@/services/EndPoints";

export const useGetLoggedUserQuery = () => {
    return useQuery({
        queryKey: ["logged-user"],
        queryFn: (): Promise<TSuccessAPIResponse<any> | TErrorAPIResponse> => ApiMethods.get<any>(ENDPOINTS.VERIFY_LOGGED_USER()),
    })
}

