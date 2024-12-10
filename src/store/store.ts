import {configureStore} from "@reduxjs/toolkit";

import {authReducer, groupReducer, orderReducer, userReducer} from "./slices";


const store = configureStore({
    reducer: {
        orders: orderReducer,
        users: userReducer,
        auth: authReducer,
        groups: groupReducer
    }
})
export type AppDispatch = typeof store.dispatch;
export {
    store
}