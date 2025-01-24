import { useMutation, UseMutationResult } from "@tanstack/react-query";
import ApiMethods from "@/services/api/ApiMethods";

type MutationFactoryOptions = TMutationOptions & {
	endpoint: string;
	method?: "get" | "post" | "put" | "delete";
};

/**
 * Custom hook to create a mutation for a generic API endpoint.
 *
 * @param {Object} options - Options for the mutation.
 * @param {string} options.endpoint - The API endpoint to send the mutation to.
 * @param {Function} options.onSuccess - Called when the mutation is successful.
 * @param {Function} options.onError - Called when the mutation fails.
 *
 * @returns {UseMutationResult} - The result of the mutation.
 */
export const useHookMutation = ({
	endpoint,
	onSuccess,
	onError,
	...options
}: MutationFactoryOptions): UseMutationResult<TSuccessAPIResponse<any> | TErrorAPIResponse> => {
	if (!endpoint) {
		throw new Error("Invalid endpoint: must be a non-empty string");
	}

	return useMutation({
		mutationFn: (body): Promise<TSuccessAPIResponse<any> | TErrorAPIResponse> => {
			if (!body || typeof body !== "object")
				throw new Error("Invalid body: must be an object");

			return ApiMethods[options?.method || "post"](endpoint, body);
		},
		onSuccess(data) {
			console.log(data);
			if (onSuccess) onSuccess(data);
		},
		onError(error) {
			if (onError) onError(error);
		},
		...options,
	});
};
