import { errorApiResponseExtractor } from "@/lib/utils";
import axios from "axios";

/**
 * Represents a function to register a user by sending a POST request to the '/api/auth/register' endpoint.
 * @template T - The type of data to be sent in the request body.
 * @param {T} data - The data to be sent in the request body.
 * @returns {Promise<any>} A Promise that resolves with the response data.
 * @throws {TErrorAPIResponse} Throws an error if registration fails.
 */
export const register = async <T>(data: T): Promise<any> => {
	try {
		const response = await axios.post("/api/auth/register", data);
		return response.data;
	} catch (error) {
		/**
		 * extract and throw error response data based on the {TErrorAPIResponse} type
		 */
		throw errorApiResponseExtractor(error);
	}
};

/**
 * Represents the login function that sends a POST request to the '/api/auth/login' endpoint.
 * @param {T} data - The data to be sent in the request body.
 * @returns {Promise<any>} A Promise that resolves with the response data.
 */
export const login = async <T>(data: T): Promise<any> => {
	return axios.post("/api/auth/login", data);
};
