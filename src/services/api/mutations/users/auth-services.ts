import { UseMutationResult } from "@tanstack/react-query";
import { useHookMutation } from "../mutation-hook";

export const usePostLoginMutation = ({
	...options
}: TMutationOptions): UseMutationResult<TSuccessAPIResponse<any> | TErrorAPIResponse> =>
	useHookMutation({ endpoint: "/auth/login", ...options });

export const usePostRegisterMutation = ({
	...options
}: TMutationOptions): UseMutationResult<TSuccessAPIResponse<any> | TErrorAPIResponse> =>
	useHookMutation({ endpoint: "/auth/register", ...options });

export const usePostVerifyEmailMutation = ({
	...options
}: TMutationOptions): UseMutationResult<TSuccessAPIResponse<any> | TErrorAPIResponse> =>
	useHookMutation({ endpoint: "/auth/validate/email", ...options });
