import { UseMutationResult } from "@tanstack/react-query";
import { useHookMutation } from "./mutation-hook";

export const usePostCreateCollectionsMutation = ({
	...options
}: TMutationOptions): UseMutationResult<
	TSuccessAPIResponse<any> | TErrorAPIResponse
> => useHookMutation({ endpoint: "/resource-collections/create", ...options });

export const usePostCreateResourceCollectionsMutation = ({
	...options
}: TMutationOptions): UseMutationResult<
	TSuccessAPIResponse<any> | TErrorAPIResponse
> =>
	useHookMutation({
		endpoint: "/resource-collections/add-resource",
		...options,
	});

export const useDeleteCollectionFoldersMutation = ({
	...options
}: TMutationOptions) =>
	useHookMutation({
		method: "delete",
		endpoint: "/resource-collections",
		...options,
	});
