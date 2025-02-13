import { createSlice } from '@reduxjs/toolkit';

import {IUser} from "../../interfaces";


const token = localStorage.getItem('accessToken');
interface AuthState {
    isAuthenticated: boolean,
    user: IUser | null;
}
const initialState: AuthState = {
    isAuthenticated: !!token,
    user: token ? JSON.parse(localStorage.getItem("user") || "{}") : null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess(state, action) {
            state.user = action.payload.user;
            state.isAuthenticated = true;
            localStorage.setItem('user', JSON.stringify(action.payload.user));
        },
        logout(state) {
            state.isAuthenticated = false;
            state.user = null;
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
        },
    },
});

const { reducer: authReducer, actions } = authSlice;
const authActions = {
    ...actions,
}

export {
    authReducer,
    authActions
}