import { UseMutationResult } from "@tanstack/react-query";
import { useHookMutation } from "../mutation-hook";

export const usePostResourceMutation = ({
	...options
}: TMutationOptions): UseMutationResult<
	TSuccessAPIResponse<any> | TErrorAPIResponse
> => useHookMutation({ endpoint: "/resource", ...options });
