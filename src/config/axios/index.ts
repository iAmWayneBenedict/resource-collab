import axios from "axios";

const apiRoute = `${process.env.NEXT_PUBLIC_BASE_URL}/api/${process.env.NEXT_PUBLIC_SERVER_API_VERSION}/${process.env.NEXT_PUBLIC_SERVER_API_TYPE}`;

const request = axios.create({
	baseURL: apiRoute,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});

request.interceptors.request.use(
	(config) => {
		// add config here before the request is sent

		return config;
	},
	(error) => Promise.reject(error),
);

request.interceptors.response.use(
	(response) => {
		return response.data;
	},
	(error) => Promise.reject(error),
);

export default request;
