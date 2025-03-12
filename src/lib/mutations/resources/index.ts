import { UseMutationResult } from "@tanstack/react-query";
import { useHookMutation } from "../mutation-hook";

export const usePostResourceMutation = ({
	...options
}: TMutationOptions): UseMutationResult<
	TSuccessAPIResponse<any> | TErrorAPIResponse
> => useHookMutation({ endpoint: "/resources", ...options });

export const useDeleteResourceMutation = ({
	...options
}: TMutationOptions): UseMutationResult<
	TSuccessAPIResponse<any> | TErrorAPIResponse
> => useHookMutation({ endpoint: "/resources", method: "delete", ...options });

export const usePutResourceMutation = ({
	params,
	...options
}: TMutationOptions): UseMutationResult<
	TSuccessAPIResponse<any> | TErrorAPIResponse
> =>
	useHookMutation({
		endpoint: "/resources/" + params,
		method: "put",
		...options,
	});

export const usePutViewResourceMutation = ({
	params,
	...options
}: TMutationOptions) =>
	useHookMutation({
		endpoint: `/resources/${params}/view`,
		method: "put",
		...options,
	});
