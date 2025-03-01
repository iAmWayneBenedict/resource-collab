import { UseMutationResult } from "@tanstack/react-query";
import { useHookMutation } from "./mutation-hook";

export const usePostCollectionsMutation = ({
	...options
}: TMutationOptions): UseMutationResult<
	TSuccessAPIResponse<any> | TErrorAPIResponse
> => useHookMutation({ endpoint: "/resource-collections", ...options });
