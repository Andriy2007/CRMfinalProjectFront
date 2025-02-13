import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { Navigate } from 'react-router-dom';
import {apiService} from "../../services";
import {urls} from "../../constants/urls";
import {authActions} from "../../store/slices";


const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const refreshAccessToken = async () => {
            const refreshToken = localStorage.getItem("refreshToken");
            if (!refreshToken) {
                setLoading(false);
                return;
            }
            try {
                const response = await apiService.post(
                    urls.refreshToken,
                    { refreshToken },
                    { withCredentials: true }
                );
                if (response.data.tokens && response.data.tokens.accessToken) {
                    localStorage.setItem("accessToken", response.data.tokens.accessToken);
                    localStorage.setItem("refreshToken", response.data.tokens.refreshToken);
                    localStorage.setItem("user", JSON.stringify(response.data.user));
                    dispatch(authActions.loginSuccess({ user: response.data.user }));
                } else {
                    throw new Error("No new accessToken received");
                }
            } catch (error) {
                console.error("Refresh token failed", error);
                dispatch(authActions.logout());
            } finally {
                setLoading(false);
            }
        };
        if (!localStorage.getItem("accessToken")) {
            refreshAccessToken();
        } else {
            setLoading(false);
        }
    }, [dispatch]);

    if (loading) return <p>Перевірка авторизації...</p>;
    return isAuthenticated ? <>{children}</> : <Navigate to="/logIn" />;
};

export {AuthRoute} ;