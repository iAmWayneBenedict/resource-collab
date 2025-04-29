import config from "@/config";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetIPInfo = () => {
	return useQuery({
		queryKey: ["ip-info"],
		queryFn: async () => {
			return axios(
				`https://ipinfo.io/json?token=${config.IP_INFO_TOKEN}`,
			);
		},
	});
};
