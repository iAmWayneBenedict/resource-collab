import { UseMutationResult } from "@tanstack/react-query";
import { useHookMutation } from "../mutation-hook";

export const usePutUserMutation = ({
	...options
}: TMutationOptions): UseMutationResult<TSuccessAPIResponse<any> | TErrorAPIResponse> =>
	useHookMutation({
		endpoint: "/user" + new URLSearchParams(options?.params) || "",
		method: "put",
		...options,
	});
