import axios from "axios";

const axiosRequest = axios.create({
    baseURL: process.env.BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
})

axiosRequest.interceptors.request.use(
    (config) => {
        
        // add config here before the request is sent
        
        return config
    },
    (error) => Promise.reject(error)
)

axiosRequest.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => Promise.reject(error)
)

export default axiosRequest