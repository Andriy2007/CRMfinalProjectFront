import axios from "axios"

import {baseURL} from "../constants/urls";


const apiService = axios.create({baseURL});
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
export {
    apiService
}