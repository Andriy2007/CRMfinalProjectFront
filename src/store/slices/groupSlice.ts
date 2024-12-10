import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {AxiosError} from "axios";

import {IGroup} from "../../interfaces";
import {groupService} from "../../services";


 interface IState {
    groups: IGroup[];
}

const initialState: IState = {
    groups: [],
};

const getGroups = createAsyncThunk<IGroup[]>(
    'groupSlice/getGroups',
    async (_, thunkAPI) => {
        try {
            const response = await groupService.getGroups();
            return response.data as IGroup[];
        } catch (error) {
            const axiosError = error as AxiosError;
            return thunkAPI.rejectWithValue(axiosError.response?.data ?? 'Failed to fetch groups');
        }
    }
);
const addGroup = createAsyncThunk<IGroup, string>(
    'groupSlice/addGroup',
    async (groupName, thunkAPI) => {
        try {
            const { data } = await groupService.addGroup(groupName);
            return { _id: data.name, name: groupName, groups: [], data: [] };

        } catch (error) {
            const axiosError = error as AxiosError;
            return thunkAPI.rejectWithValue(axiosError.response?.data ?? 'Failed to add group');
        }
    }
);

const groupSlice = createSlice({
    name: 'groupSlice',
    initialState,
    reducers: {},
    extraReducers: builder =>
        builder
            .addCase(getGroups.fulfilled, (state, action) => {
                state.groups = action.payload;
            })
            .addCase(addGroup.fulfilled, (state, action) => {
                state.groups.push(action.payload);
            }),
})
const {reducer: groupReducer, actions} = groupSlice;
const groupActions = {
    ...actions,
    getGroups,
    addGroup,
}

export {
    groupReducer,
    groupActions
}