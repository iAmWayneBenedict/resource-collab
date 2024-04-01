import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function isServer() {
	return typeof window === "undefined";
}

/**
 * Description: converts the data to json
 *
 * @export
 * @template T - (Generic type) will be inferred from the data
 * @param {T} data - data to be converted to json
 * @returns {number | string | boolean | object}
 */
export function toJson<T>(data: T): number | string | boolean | object {
	return JSON.parse(JSON.stringify(data));
}

/**
 * Description: converts the data to string
 *
 * @export
 * @template T - (Generic type) will be inferred from the data
 * @param {T} data - data to be converted to string
 * @returns {string}
 */
export function toStr<T>(data: T) {
	return JSON.stringify(data);
}

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
	return { data, status, message };
};
