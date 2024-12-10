import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import  {AxiosError} from "axios";

import {urls} from "../../constants/urls";
import {IOrder, IOrders} from "../../interfaces";
import {apiService, ordersService} from "../../services";

interface IState {
    orders: IOrder[],
    order: IOrder | null,

}
interface IUpdateOrderParams {
    _id: string;
    updatedOrder: IOrder;
}
const initialState: IState = {
    orders: [],
    order: null,

};

const getAllOrders = createAsyncThunk<IOrders, {page: string, course_format:string, course:string, course_type:string, status:string,
    searchByName:string, searchBySurname:string, searchByEmail:string, searchByPhone:string, searchByAge:string, order:string, orderBy:string }>(
    'getAllOrders',
    async ({page,course_format, course, course_type , status,
               searchByName, searchBySurname, searchByEmail, searchByPhone, searchByAge,
               order, orderBy}, thunkAPI) => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No token found');
            }
            const config = token ? { headers: { Authorization: `${token}` } } : {};
            const {data} = await ordersService.getAllOrders(page, config,course_format, course, course_type , status,
                searchByName, searchBySurname, searchByEmail, searchByPhone, searchByAge, order, orderBy, );
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
    reducers: {},
    extraReducers: builder =>
        builder
            .addCase(getAllOrders.fulfilled, (state, action) => {
                const orders = action.payload.data;
                state.orders = orders;
            })
            .addCase(getOrdersById.fulfilled, (state, action) => {
                state.order = action.payload;
            })
            .addCase(updateOrder.fulfilled, (state, action) => {
                const updatedOrder = action.payload;
                const index = state.orders.findIndex(order => order._id === updatedOrder._id);
                if (index !== -1) {state.orders[index] = updatedOrder;}
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