import axios from "axios"

import {baseURL} from "../constants/urls";


const apiService = axios.create({baseURL});
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onRefreshed = (token: string) => {
    refreshSubscribers.forEach((callback) => callback(token));
    refreshSubscribers = [];
};

apiService.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiService.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            if (!isRefreshing) {
                isRefreshing = true;
                try {
                    const refreshToken = localStorage.getItem("refreshToken");
                    if (!refreshToken) {
                        throw new Error("Refresh token відсутній");
                    }
                    const response = await axios.post(`${baseURL}/auth/refresh-token`, { refreshToken });
                    const { accessToken, refreshToken: newRefreshToken } = response.data.tokens;
                    localStorage.setItem("accessToken", accessToken);
                    localStorage.setItem("refreshToken", newRefreshToken);
                    isRefreshing = false;
                    onRefreshed(accessToken);
                } catch (refreshError) {
                    isRefreshing = false;
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");
                    window.location.href = "/logIn";
                    return Promise.reject(refreshError);
                }
            }
            return new Promise((resolve) => {
                refreshSubscribers.push((token) => {
                    originalRequest.headers.Authorization = `${token}`;
                    resolve(apiService(originalRequest));
                });
            });
        }
        return Promise.reject(error);
    }
);

export {apiService};