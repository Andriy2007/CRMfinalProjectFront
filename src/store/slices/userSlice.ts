import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {AxiosError} from "axios";

import {IUser, IUsers} from "../../interfaces";
import {userService} from "../../services";


interface IState {
    users: IUser[],
    user: IUser | null,
}
const initialState: IState = {
    users: [],
    user: null,
};

const getAllUsers = createAsyncThunk<IUsers>(
    'getAllUsers',
    async (_, thunkAPI) => {
        try {
            const token = localStorage.getItem('accessToken');
            const config = token ? { headers: { Authorization: `${token}` } } : {};
            const {data} = await userService.getAllUsers(config);
            return data;
        } catch (e) {
            const error = e as AxiosError
            return thunkAPI.rejectWithValue(error.response?.data ?? 'Unknown error occurred');
        }
    }
)
const userSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: {},
    extraReducers: builder =>
        builder.addCase(getAllUsers.fulfilled, (state, action) => {
            const users = action.payload.data;
            state.users = users;
        })
})
const {reducer: userReducer, actions} = userSlice;
const userActions = {
    ...actions,
    getAllUsers
}

export {
    userReducer,
    userActions
}