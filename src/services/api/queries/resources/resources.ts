import { useQuery } from "@tanstack/react-query";
import request from "@/config/axios";

export const useGetPaginatedResourcesQuery = (filters: any): any => {
  const searchParams = new URLSearchParams(filters);
  return useQuery({
    queryKey: ["paginated-resources"],
    queryFn: () => request({ url: "/resources?" + searchParams.toString() }),
  });
};
