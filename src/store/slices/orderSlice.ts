import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import  {AxiosError} from "axios";

import {urls} from "../../constants/urls";
import {IOrder, IOrders, IUser} from "../../interfaces";
import {apiService, ordersService} from "../../services";


interface IOrderStatistics {
    total: number;
    statusCounts: Record<string, number>;
}

interface IUserOrderStatistics {
    [userId: string]: {
        total: number;
        statusCounts: Record<string, number>;
    };
}

interface IState {
    orders: IOrder[],
    order: IOrder | null,
    statistics: IOrderStatistics;
    userStatistics: IUserOrderStatistics;
    users: IUser[],
    user: IUser | null,
}
interface IUpdateOrderParams {
    _id: string;
    updatedOrder: IOrder;
}
const initialState: IState = {
    orders: [],
    order: null,
    statistics: {
        total: 0,
        statusCounts: {},
    },
    userStatistics: {},
    users: [],
    user: null,
};

const getAllOrders = createAsyncThunk<IOrders, {page: string,  limit: string, course_format:string, course:string, course_type:string, status:string,
    searchByName:string, searchBySurname:string, searchByEmail:string, searchByPhone:string, searchByAge:string, order:string, orderBy:string }>(
    'getAllOrders',
    async ({page,limit,course_format, course, course_type , status,
               searchByName, searchBySurname, searchByEmail, searchByPhone, searchByAge,
               order, orderBy}, thunkAPI) => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No token found');
            }
            const config = token ? { headers: { Authorization: `${token}` } } : {};
            const {data} = await ordersService.getAllOrders(page,limit, config,course_format, course, course_type , status,
                searchByName, searchBySurname, searchByEmail, searchByPhone, searchByAge, order, orderBy,    );
            return data;
        } catch (e) {
            const error = e as AxiosError
            return thunkAPI.rejectWithValue(error.response?.data ?? 'Unknown error occurred');
        }
    }
)
const getOrdersById = createAsyncThunk<IOrder, string>(
    'orderSlice/getOrdersById',
    async (_id,  thunkAPI ) => {
        try {
            const {data} = await ordersService.getOrdersById(String(_id));
            return data;
        } catch (e) {
            const error = e as AxiosError
            return thunkAPI.rejectWithValue(error.response?.data ?? 'Unknown error occurred');
        }
    }
)
const updateOrder = createAsyncThunk<IOrder, IUpdateOrderParams>(
    'orders/updateOrder',
    async ({ _id, updatedOrder }, thunkAPI) => {
        try {
            const { data } = await apiService.put(`${urls.orders}/${_id}`, updatedOrder);
            return data;
        }
        catch (error) {
            const axiosError = error as AxiosError;
            return thunkAPI.rejectWithValue(axiosError.response?.data ?? 'Unknown error occurred');

        }
    }
);

const orderSlice = createSlice({
    name: 'orderSlice',
    initialState,
    reducers: {
        addOrders: (state, action) => {
            state.orders = [...state.orders, ...action.payload];
        },
    },
    extraReducers: builder =>
        builder
            .addCase(getAllOrders.fulfilled, (state, action) => {
                const orders = action.payload.data;
                const users = state.users;
                state.orders = orders;
                const statistics = {
                    total: orders.length,
                    statusCounts: orders.reduce((acc: Record<string, number>, order: IOrder) => {
                        acc[order.status] = (acc[order.status] || 0) + 1;
                        return acc;
                    }, {}),
                };
                state.statistics = statistics;
                const userStatistics: IUserOrderStatistics = {};
                orders.forEach(order => {
                    const userId = order.manager;
                    if (!userId) return;
                    if (!userStatistics[userId]) {
                        userStatistics[userId] = {
                            total: 0,
                            statusCounts: {},
                        };
                    }
                    userStatistics[userId].total += 1;
                    userStatistics[userId].statusCounts[order.status] =
                        (userStatistics[userId].statusCounts[order.status] || 0) + 1;
                });
                users.forEach((user: IUser) => {
                    const userId = user._id;
                    if (!userStatistics[userId]) {
                        userStatistics[userId] = { total: 0, statusCounts: {} };
                    }
                });
                state.userStatistics = userStatistics;
            })
            .addCase(updateOrder.fulfilled, (state, action) => {
                const updatedOrder = action.payload;
                state.orders = state.orders.map(order =>
                    order._id === updatedOrder._id ? updatedOrder : order
                );
            })
})
const {reducer: orderReducer, actions} = orderSlice;
const orderActions = {
    ...actions,
    getAllOrders,
    updateOrder,
    getOrdersById,
}
export {
    orderReducer,
    orderActions
}