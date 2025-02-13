import axios from "axios";
import {baseURL} from "../constants/urls";


const refreshToken = async () => {
    try {
        const storedRefreshToken = localStorage.getItem("refreshToken");
        if (!storedRefreshToken) throw new Error("No refresh token available");

        const response = await axios.post(`${baseURL}/auth/refresh-token`, {
            refreshToken: storedRefreshToken
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data.tokens;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        return accessToken;
    } catch (error) {
        console.error("Failed to refresh token, logging out");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/logIn";
        throw error;
    }
};

export {refreshToken};