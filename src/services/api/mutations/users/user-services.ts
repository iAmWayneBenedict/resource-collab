import { UseMutationResult } from "@tanstack/react-query";
import ENDPOINTS from "../../EndPoints";
import { useHookMutation } from "../mutation-hook";

export const usePutUserMutation = ({
	...options
}: TMutationOptions): UseMutationResult<TSuccessAPIResponse<any> | TErrorAPIResponse> =>
	useHookMutation({ endpoint: ENDPOINTS.USER(options?.params), method: "put", ...options });
