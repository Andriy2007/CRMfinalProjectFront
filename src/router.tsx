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
            { path: 'orders', element: <AuthRoute><OrdersPage /></AuthRoute> },
            { path: 'users', element:<AuthRoute> <UsersPage /></AuthRoute> },
            { path: 'set-password/:token', element: <SetPasswordPage  /> },
            { path: 'logIn', element: <AuthPage /> },
        ],
    },
]);
export {
    router
}