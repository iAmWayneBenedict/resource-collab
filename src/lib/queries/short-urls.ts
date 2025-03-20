import { useQuery } from "@tanstack/react-query";
import request from "@/config/axios";

export const useGetResourceShortUrlRedirect = ({
	short_code,
}: {
	short_code: string;
}) => {
	return useQuery({
		enabled: !!short_code,
		queryKey: ["web-scraper", short_code],
		queryFn: () => request({ url: "/r/" + short_code }),
		retry: 1,
	});
};
