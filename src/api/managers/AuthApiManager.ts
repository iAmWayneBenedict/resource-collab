import ApiMethods from "../ApiMethods";
import ENDPOINTS from "../EndPoints";
import { queryParamsHandler } from "../utils";

/**
 * Class representing API methods for making HTTP requests.
 */
class AuthApiManager {
	static login = async (body = {}) => {
		return ApiMethods.post<any>(ENDPOINTS.LOGIN(), body);
	};
	static register = async (body = {}) => {
		return ApiMethods.post(ENDPOINTS.REGISTER(), body);
	};
	static logout = async (body = {}) => {
		return ApiMethods.get<any>(ENDPOINTS.LOGOUT());
	};
	static isEmailExists = async (params = {}) => {
		return ApiMethods.get<any>(ENDPOINTS.IS_EMAIL_EXISTS(queryParamsHandler(params)));
	};
	static verifyEmail = async (body = {}) => {
		return ApiMethods.post<any>(ENDPOINTS.VERIFY_EMAIL(), body);
	};
	static verifyLoggedUser = async (body = {}) => {
		return ApiMethods.get<any>(ENDPOINTS.VERIFY_LOGGED_USER());
	};
}

export default AuthApiManager;
