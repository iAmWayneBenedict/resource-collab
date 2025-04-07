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
	return JSON.parse(JSON.stringify(data)); // convert to string because data can be of any type and parse will convert it to json
}

/**
 * Description: converts the data to string
 *
 * @export
 * @template T - (Generic type) will be inferred from the data
 * @param {T} data - data to be converted to string
 * @returns {string}
 */
export function toStr<T>(data: T): string {
	return JSON.stringify(data);
}
/**
 * Checks if a given string is a valid URL or not.
 * @param {string} url - The URL to check.
 * @returns {boolean} true if the URL is valid, false otherwise.
 */
export function isValidUrl(url: string): boolean {
	try {
		new URL(url);
		return true;
	} catch (_) {
		return false;
	}
}

export const delay = (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Reinitializes the query parameters of the given currentUrl by replacing
 * or deleting the query parameters with the given objParams.
 *
 * @param {string} currentUrl - the current url
 * @param {Record<string, string>} [objParams] - the object containing the query parameters to be updated
 * @returns {string} the new url with the query parameters updated
 */
export const reInitQueryParams = (
	currentUrl: string,
	objParams?: Record<string, string>,
): string => {
	if (!currentUrl) return "/";
	const BASE_URL = currentUrl.split("?")[0];
	const searchParams = new URLSearchParams(new URL(currentUrl).search);

	if (objParams) {
		Object.entries(objParams).forEach(([paramKey, paramValue]) => {
			// if empty query param, remove
			if (!paramValue) {
				searchParams.delete(paramKey);
				return;
			}
			searchParams.set(paramKey, paramValue);
		});
	}

	return BASE_URL + "?" + searchParams.toString();
};

/**
 * ! WORKAROUND: This is a workaround for the bug in Lenis. Remove this when the bug is fixed.
 * Toggle the scrollability of the body element. When state is true, this
 * function sets the overflow of the body to "hidden" and adds a data-lenis-prevent
 * attribute to the body element to prevent the body from being scrollable.
 * When state is false, this function sets the overflow of the body to "auto"
 * and removes the data-lenis-prevent attribute from the body element, allowing
 * the body to be scrollable again.
 *
 * @param {boolean} state - whether the body should be scrollable or not
 */
export const toggleScrollBody = (state: boolean) => {
	if (state) {
		document.body.style.overflowY = "hidden"; // standard no-scroll implementation
		document.body.setAttribute("data-lenis-prevent", "true"); // Make sure you pass true as string
	} else {
		document.body.removeAttribute("style"); // Make sure you pass true as string
		document.body.removeAttribute("data-lenis-prevent"); // Make sure you pass true as string
	}
};

export const formatDate = (date: string) => {
	return new Intl.DateTimeFormat("en-US").format(new Date(date));
};

/**
 * Structures the object passed and returns the query parameters for an HTTP request.
 *
 * @param {Record<string, string | number | boolean | undefined>} queryParams - The query parameters in object.
 * @returns {string} The query parameters for an HTTP request.
 */
export const queryParamsHandler = (
	queryParams: Record<string, string | number | boolean | undefined>,
): string => {
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
export const getHeaders = (): Record<string, string> => {
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
 * @param response
 */
export const successApiResponseExtractor = <T>(
	response: any,
): TSuccessAPIResponse<T> => {
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

/**
 * Given a URLSearchParams object, returns an object containing the pagination
 * parameters to be used in a REST API query. The returned object contains the
 * following properties:
 * - page: the current page number (default is 1)
 * - limit: the number of items per page (default is 10)
 * - search: the search query string (default is undefined)
 * - sortBy: the field to sort the items by (default is undefined)
 * - sortType: the type of sorting (default is undefined)
 * - filterBy: the field to filter the items by (default is undefined)
 * - filterValue: the value to filter the items by (default is undefined)
 *
 * @param {URLSearchParams} searchParams - the URLSearchParams object to be
 *   used to extract the pagination parameters
 * @returns {Object} an object containing the pagination parameters
 */
export const getApiPaginatedSearchParams = (searchParams: URLSearchParams) => {
	const page = Number(searchParams.get("page")) || 1;
	const limit = Number(searchParams.get("limit")) || 10;
	const search = searchParams.get("search") ?? undefined;
	const sortBy = searchParams.get("sort_by") ?? undefined;
	const sortType = searchParams.get("sort_type") ?? undefined;
	const filterBy = searchParams.get("filter_by") ?? undefined;
	const filterValue = searchParams.get("filter_value") ?? undefined;

	return { page, limit, search, sortBy, sortType, filterBy, filterValue };
};
