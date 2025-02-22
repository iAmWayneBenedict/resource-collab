import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import config from "@/config";

export const usePostDeleteUploadThingFileMutation = () => {
	return useMutation({
		mutationFn: async (data: any) => {
			// const response = await axios.post(
			// 	config.UPLOADTHING_API_URL + "/deleteFiles",
			// 	data,
			// 	{
			// 		headers: {
			// 			"Content-Type": "application/json",
			// 			"X-Uploadthing-Api-Key": config.UPLOADTHING_API_KEY,
			// 		},
			// 	},
			// );
			// return response;
			const response = await fetch(
				config.UPLOADTHING_API_URL + "/deleteFiles",
				{
					method: "POST",
					headers: {
						"X-Uploadthing-Api-Key":
							config.UPLOADTHING_API_KEY || "",
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						fileKeys: data,
					}),
				},
			);

			return await response.json();
		},
	});
};
