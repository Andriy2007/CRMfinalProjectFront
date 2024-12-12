import React from 'react';
import {createBrowserRouter, Navigate} from "react-router-dom";

import {MainLayout} from "./layouts/MainLayout";
import {AuthPage, OrdersPage, UsersPage} from "./pages";
import {AuthRoute} from "./components/Auth";


import {SetPasswordPage} from "./components/User/SetPasswordPage";


const router = createBrowserRouter([
    {
        path: '',
        element: <MainLayout />,
        children: [
            { index: true, element: <Navigate to="logIn" /> },
            { path: 'orders', element: <OrdersPage /> },
            { path: 'users', element: <UsersPage /> },
            { path: 'set-password/:token', element: <SetPasswordPage  /> },
            { path: 'logIn', element: <AuthRoute><AuthPage /></AuthRoute> },
        ],
    },
]);
export {
    router
}