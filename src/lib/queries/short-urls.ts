import { useQuery } from "@tanstack/react-query";
import request from "@/config/axios";

export const useGetResourceShortUrlRedirect = ({
	short_code,
}: {
	short_code: string;
}) => {
	return useQuery({
		enabled: !!short_code,
		queryKey: ["get-resource-short-code-redirect", short_code],
		queryFn: () => request({ url: "/r/" + short_code }),
		retry: 1,
	});
};
export const useGetResourceShortUrl = ({
	resourceId,
	enabled,
}: {
	resourceId: number;
	enabled: boolean;
}) => {
	return useQuery({
		enabled: enabled,
		queryKey: ["resource-short-url", resourceId, enabled],
		queryFn: () => request({ url: `/resources/${resourceId}/shorten` }),
		retry: 1,
	});
};
export const useGetCollectionShortUrlRedirect = ({
	short_code,
}: {
	short_code: string;
}) => {
	return useQuery({
		enabled: !!short_code,
		queryKey: ["get-collection-short-code-redirect", short_code],
		queryFn: () => request({ url: "/c/" + short_code }),
		retry: 1,
	});
};

export const useGetCollectionShortUrl = ({
	collectionId,
	enabled,
}: {
	collectionId: number;
	enabled: boolean;
}) => {
	return useQuery({
		enabled: enabled,
		queryKey: ["collection-short-url", collectionId, enabled],
		queryFn: () =>
			request({ url: `/resource-collections/${collectionId}/shorten` }),
		retry: 1,
	});
};
