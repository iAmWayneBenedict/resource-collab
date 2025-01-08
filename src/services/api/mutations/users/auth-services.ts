import { UseMutationResult } from "@tanstack/react-query";
import ENDPOINTS from "@/services/api/EndPoints";
import { useHookMutation } from "../mutation-hook";

export const usePostLoginMutation = ({
	...options
}: TMutationOptions): UseMutationResult<TSuccessAPIResponse<any> | TErrorAPIResponse> =>
	useHookMutation({ endpoint: ENDPOINTS.LOGIN(), ...options });

export const usePostRegisterMutation = ({
	...options
}: TMutationOptions): UseMutationResult<TSuccessAPIResponse<any> | TErrorAPIResponse> =>
	useHookMutation({ endpoint: ENDPOINTS.REGISTER(), ...options });

export const usePostVerifyEmailMutation = ({
	...options
}: TMutationOptions): UseMutationResult<TSuccessAPIResponse<any> | TErrorAPIResponse> =>
	useHookMutation({ endpoint: ENDPOINTS.VERIFY_EMAIL(), ...options });
