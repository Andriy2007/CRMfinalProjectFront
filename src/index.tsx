import React, {useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import {Provider, useDispatch} from "react-redux";
import {RouterProvider} from "react-router-dom";

import {store} from "./store/store";
import {router} from "./router";
import {authActions} from "./store/slices";
import './index.css';


const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement);

const AppWithAuthCheck = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            dispatch(authActions.loginSuccess({ user, token }));

        }
    }, [dispatch]);
    return <RouterProvider router={router} />;
};

root.render(
    <Provider store={store}>
        <AppWithAuthCheck />
    </Provider>
);