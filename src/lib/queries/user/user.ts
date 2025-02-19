import { useQuery } from "@tanstack/react-query";
import request from "@/config/axios";

export const useGetPaginatedUsersQuery = (filters: any): any => {
  const searchParams = new URLSearchParams(filters);
  return useQuery({
    queryKey: ["users"],
    queryFn: () => request({ url: "/users?" + searchParams.toString() }),
  });
};
