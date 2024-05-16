/**
 * Structures the object passed and returns the query parameters for an HTTP request.
 *
 * @param {Record<string, string | number | boolean | undefined>} queryParams - The query parameters in object.
 * @returns {string} The query parameters for an HTTP request.
 */
export const queryParamsHandler = (
	queryParams: Record<string, string | number | boolean | undefined>
) => {
	let query = "?";
	Object.keys(queryParams).forEach((key) => {
		if (queryParams[key]) {
			query += `${key}=${queryParams[key]}&`;
		}
	});
	return query;
};

/**
 * Returns the headers for an HTTP request.
 * @returns {Record<string, string>} The headers for an HTTP request.
 */
export const getHeaders = () => {
	// ! change this to your token
	const getToken = localStorage.getItem("token") || null;

	return {
		"Content-Type": "application/json",
		Authorization: `Bearer ${getToken}`,
	};
};

/**
 * Extracts success response data from an Axios response object.
 * @template T - The type of success response data to be extracted.
 * @param {any} data - The Axios response object.
 * @returns {TSuccessAPIResponse<T>} The extracted success response data.
 *
 * @example
 * ```typescript
 * try {
 *   const response = await axios.post("/api/auth/register", data);
 *   return successApiResponseExtractor(response.data);
 * } catch (error) {
 *   throw errorApiResponseExtractor(error);
 * }
 * ```
 */
export const successApiResponseExtractor = <T>(response: any): TSuccessAPIResponse<T> => {
	const { status } = response;
	const message = response.data.message || "Success";
	return { data: response.data.data, status, message };
};

/**
 * Extracts error response data from an Axios error response object.
 * @template TErrorAPIResponse - The type of error response data to be extracted.
 * @param {any} error - The Axios error response object.
 * @returns {TErrorAPIResponse} The extracted error response data.
 *
 * @example
 * ```typescript
 * try {
 *   const response = await axios.post("/api/auth/register", data);
 *   return response.data;
 * } catch (error) {
 *   throw errorApiResponseExtractor(error);
 * }
 * ```
 */
export const errorApiResponseExtractor = (error: any): TErrorAPIResponse => {
	const { data, status } = error.response;
	const message = data.message || "An error occurred";

	return { data: data.data, status, message };
};
