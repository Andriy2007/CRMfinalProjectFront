import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {AxiosError} from "axios";

import {IUser, IUsers} from "../../interfaces";
import {userService} from "../../services";


interface IState {
    users: IUser[],
    user: IUser | null,
    total: number;
    limit: number;
}
const initialState: IState = {
    users: [],
    user: null,
    total: 0,
    limit: 4,
};

const getAllUsers = createAsyncThunk<IUsers, { page: number, limit: number }>(
    'getAllUsers',
    async ({ page, limit }, thunkAPI) => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No token found');
            }
            const config = token ? { headers: { Authorization: `${token}` } } : {};
            const {data} = await userService.getAllUsers({ page, limit },config);
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
            return data;
        } catch (e) {
            const error = e as AxiosError;
            return thunkAPI.rejectWithValue(error.response?.data ?? "Unknown error occurred");
        }
    }
);
const setPasswordUser = createAsyncThunk(
    "setPasswordUser",
    async ({ token, password }: { token: string; password: string }, thunkAPI) => {
        try {
            await userService.setPassword(token, password);
            return "Password set successfully!";
        } catch (e) {
            const error = e as AxiosError;
            return thunkAPI.rejectWithValue(error.response?.data ?? "Failed to set password");
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
            state.total = action.payload.total;
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
    setPasswordUser,
}

export {
    userReducer,
    userActions
}