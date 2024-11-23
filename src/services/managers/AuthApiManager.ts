import ApiMethods from "../ApiMethods";
import ENDPOINTS from "../EndPoints";
import { queryParamsHandler } from "../utils";

/**
 * Class representing API methods for making HTTP requests.
 */
class AuthApiManager {
	static readonly login = async (body = {}) => {
		return ApiMethods.post<any>(ENDPOINTS.LOGIN(), body);
	};
	static readonly register = async (body = {}) => {
		return ApiMethods.post(ENDPOINTS.REGISTER(), body);
	};
	static readonly logout = async (body = {}) => {
		return ApiMethods.get<any>(ENDPOINTS.LOGOUT());
	};
	static readonly isEmailExists = async (params = {}) => {
		return ApiMethods.get<any>(ENDPOINTS.IS_EMAIL_EXISTS(queryParamsHandler(params)));
	};
	static readonly verifyEmail = async (body = {}) => {
		return ApiMethods.post<any>(ENDPOINTS.VERIFY_EMAIL(), body);
	};
	static readonly verifyLoggedUser = async (body = {}) => {
		return ApiMethods.get<any>(ENDPOINTS.VERIFY_LOGGED_USER());
	};
}

export default AuthApiManager;
