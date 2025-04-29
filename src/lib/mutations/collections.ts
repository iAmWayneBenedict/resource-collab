import { UseMutationResult } from "@tanstack/react-query";
import { useHookMutation } from "./mutation-hook";

const ROOT = "/resource-collections"

export const usePostCreateCollectionsMutation = ({
	...options
}: TMutationOptions): UseMutationResult<
	TSuccessAPIResponse<any> | TErrorAPIResponse
> => useHookMutation({ endpoint: `${ROOT}/create`, ...options });

export const usePostCreateResourceCollectionsMutation = ({
	...options
}: TMutationOptions): UseMutationResult<
	TSuccessAPIResponse<any> | TErrorAPIResponse
> =>
	useHookMutation({
		endpoint: `${ROOT}/add-resource`,
		...options,
	});

export const useDeleteCollectionFoldersMutation = ({
	...options
}: TMutationOptions) =>
	useHookMutation({
		method: "delete",
		endpoint: ROOT,
		...options,
	});
export const usePutCollectionFoldersMutation = ({
	params,
	...options
}: TMutationOptions) =>
	useHookMutation({
		method: "put",
		endpoint: `${ROOT}/${params}`,
		...options,
	});
export const usePostPinCollectionMutation = ({
	params,
	...options
}: TMutationOptions) =>
	useHookMutation({
		endpoint: `${ROOT}/${params}/pin`,
		...options,
	});
export const useDeletePinCollectionMutation = ({
	params,
	...options
}: TMutationOptions) =>
	useHookMutation({
		method: "delete",
		endpoint: `${ROOT}/${params}/pin`,
		...options,
	});
