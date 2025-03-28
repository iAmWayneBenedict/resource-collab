import { UseMutationResult } from "@tanstack/react-query";
import { useHookMutation } from "./mutation-hook";

export const usePostResourceShortUrlMutation = ({
	params,
	...options
}: TMutationOptions): UseMutationResult<
	TSuccessAPIResponse<any> | TErrorAPIResponse
> => useHookMutation({ endpoint: `/resources/${params}/shorten`, ...options });
export const usePostCollectionsShortUrlMutation = ({
	params,
	...options
}: TMutationOptions): UseMutationResult<
	TSuccessAPIResponse<any> | TErrorAPIResponse
> =>
	useHookMutation({
		endpoint: `/resource-collections/${params}/shorten`,
		...options,
	});
