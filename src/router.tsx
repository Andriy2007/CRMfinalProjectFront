import React from 'react';
import {createBrowserRouter, Navigate} from "react-router-dom";

import {MainLayout} from "./layouts/MainLayout";
import {AuthPage, OrdersPage, UsersPage} from "./pages";


const router = createBrowserRouter([
    {
        path: ``, element: <MainLayout/>, children: [
            {index: true, element: <Navigate to={"logIn"}/>},
            {path: 'orders', element: (<OrdersPage />),},
            {path: 'users', element: <UsersPage/>},
            {path: 'logIn', element: <AuthPage/>},
        ]
    }
    ])
export {
    router
}