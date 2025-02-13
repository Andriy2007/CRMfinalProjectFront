import axios from "axios"

import {baseURL} from "../constants/urls";


const apiService = axios.create({baseURL});
axios.interceptors.request.use(
    async (config) => {
        let token = localStorage.getItem('accessToken');
        if (!token) {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    const response = await apiService.post('/auth/refresh-token', {
                        refreshToken,
                    });

                    const { accessToken, refreshToken: newRefreshToken, user } = response.data.tokens;
                    localStorage.setItem('accessToken', accessToken);
                    localStorage.setItem('refreshToken', newRefreshToken);
                    localStorage.setItem('user', JSON.stringify(user));
                    token = accessToken;
                } catch (error) {
                    console.error('Failed to refresh token', error);
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('user');
                    window.location.href = '/logIn'
                }
            } else {
                window.location.href = '/logIn';
            }
        }
        if (token) {
            config.headers.Authorization = `${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export {apiService};