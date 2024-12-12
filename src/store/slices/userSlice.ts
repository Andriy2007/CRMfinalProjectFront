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
const createUser = createAsyncThunk(
    "createUser",
    async (userData: Partial<IUser>, thunkAPI) => {
        try {
            const { data } = await userService.createUser(userData);
            console.log('Sending user data:', userData);
            console.log('Sending user data:', data);
            return data;
        } catch (e) {
            const error = e as AxiosError;
            return thunkAPI.rejectWithValue(error.response?.data ?? "Unknown error occurred");
        }
    }
);

const activateUser = createAsyncThunk(
    "activateUser",
    async (userId: string, thunkAPI) => {
        try {
            const token = localStorage.getItem("accessToken");
            const config = token ? { headers: { Authorization: `${token}` } } : {};
            const { data } = await userService.activateUser(userId, config);
            navigator.clipboard.writeText(data.activationLink);
            return data;
        } catch (e) {
            const error = e as AxiosError;
            return thunkAPI.rejectWithValue(error.response?.data ?? "Unknown error occurred");
        }
    }
);


const recoveryPassword = createAsyncThunk(
    "recoveryPassword",
    async (userId: string, thunkAPI) => {
        try {
            const token = localStorage.getItem("accessToken");
            const config = token ? { headers: { Authorization: `${token}` } } : {};
            const { data } = await userService.recoveryPassword(userId, config);
            navigator.clipboard.writeText(data.activationLink);
            return data;
        } catch (e) {
            const error = e as AxiosError;
            return thunkAPI.rejectWithValue(error.response?.data ?? "Unknown error occurred");
        }
    }
);

const banUser = createAsyncThunk(
    "banUser",
    async (userId: string, thunkAPI) => {
        try {
            const token = localStorage.getItem("accessToken");
            const config = token ? { headers: { Authorization: `${token}` } } : {};
            await userService.banUser(userId, config);
            return userId;
        } catch (e) {
            const error = e as AxiosError;
            return thunkAPI.rejectWithValue(error.response?.data ?? "Unknown error occurred");
        }
    }
);

const unbanUser = createAsyncThunk(
    "unbanUser",
    async (userId: string, thunkAPI) => {
        try {
            const token = localStorage.getItem("accessToken");
            const config = token ? { headers: { Authorization: `${token}` } } : {};
            await userService.unbanUser(userId, config);
            return userId;
        } catch (e) {
            const error = e as AxiosError;
            return thunkAPI.rejectWithValue(error.response?.data ?? "Unknown error occurred");
        }
    }
);

const userSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(getAllUsers.fulfilled, (state, action) => {
            state.users = action.payload.data;
        });
        builder.addCase(createUser.fulfilled, (state, action) => {
            state.users.push(action.payload);
        });
        builder.addCase(banUser.fulfilled, (state, action) => {
            state.users = state.users.map(user =>
                user._id === action.payload ? { ...user, isBanned: true } : user
            );
        });
        builder.addCase(unbanUser.fulfilled, (state, action) => {
            state.users = state.users.map(user =>
                user._id === action.payload ? { ...user, isBanned: false } : user
            );
        });
    },
});
const {reducer: userReducer, actions} = userSlice;
const userActions = {
    ...actions,
    getAllUsers,
    createUser,
    activateUser,
    recoveryPassword,
    banUser,
    unbanUser,
}

export {
    userReducer,
    userActions
}