import { useQuery } from "@tanstack/react-query";
import axiosRequest from "@/config/axios/axios-config";

// export const useGetLoggedUserQuery = () => {
//     return useQuery({
//         queryKey: ["logged-user"],
//         queryFn: () => axiosRequest({
//             url: "/auth/validate",
//         })
//     })
// };