import axios from "axios";
import { errorApiResponseExtractor, getHeaders, successApiResponseExtractor } from "./utils";

export const BASE_URL = "http://localhost:3000/api/";

type Method = "get" | "post" | "put" | "delete";

type TApiRequestParams = {
	url: string;
	method: Method;
	body?: any;
};

/**
 * Class representing API methods for making HTTP requests.
 */
class ApiMethods {
	/**
	 * Makes an API request.
	 * @template T - The expected response type.
	 * @param {TApiRequestParams} params - Request parameters (url, method, body).
	 * @returns {Promise<TSuccessAPIResponse<T>>} - A promise resolving to the API response data.
	 */
	static async apiRequest<T>({
		url,
		method,
		body,
	}: TApiRequestParams): Promise<TSuccessAPIResponse<T>> {
		url = `${BASE_URL}${url}`;
		try {
			const response = await axios[method](url, body, { headers: getHeaders() });
			return successApiResponseExtractor<T>(response);
		} catch (error) {
			throw errorApiResponseExtractor(error);
		}
	}

	/**
	 * Sends an HTTP GET request.
	 * @template T - The expected response type.
	 * @param {string} url - The URL to request.
	 * @returns {Promise<TSuccessAPIResponse<T>>} - A promise resolving to the response data.
	 */
	static get<T>(url: string): Promise<TSuccessAPIResponse<T>> {
		return this.apiRequest<T>({ url, method: "get" });
	}

	/**
	 * Sends an HTTP POST request.
	 * @template T - The expected response type.
	 * @param {string} url - The URL to request.
	 * @param {any} body - The request body.
	 * @returns {Promise<TSuccessAPIResponse<T>>} - A promise resolving to the response data.
	 */
	static post<T>(url: string, body: any): Promise<TSuccessAPIResponse<T>> {
		return this.apiRequest<T>({ url, method: "post", body });
	}

	/**
	 * Sends an HTTP PUT request.
	 * @template T - The expected response type.
	 * @param {string} url - The URL to request.
	 * @param {any} body - The request body.
	 * @returns {Promise<TSuccessAPIResponse<T>>} - A promise resolving to the response data.
	 */
	static put<T>(url: string, body: any): Promise<TSuccessAPIResponse<T>> {
		return this.apiRequest<T>({ url, method: "put", body });
	}

	/**
	 * Sends an HTTP DELETE request.
	 * @template T - The expected response type.
	 * @param {string} url - The URL to request.
	 * @returns {Promise<TSuccessAPIResponse<T>>} - A promise resolving to the response data.
	 */
	static delete<T>(url: string): Promise<TSuccessAPIResponse<T>> {
		return this.apiRequest<T>({ url, method: "delete" });
	}
}

export default ApiMethods;
