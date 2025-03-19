import { UseMutationResult } from "@tanstack/react-query";
import { useHookMutation } from "./mutation-hook";

export const usePostResourceShortUrlMutation = ({
	...options
}: TMutationOptions): UseMutationResult<
	TSuccessAPIResponse<any> | TErrorAPIResponse
> => useHookMutation({ endpoint: "/resources/shorten", ...options });
