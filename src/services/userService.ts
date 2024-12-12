import {IRes} from "../types/responceType";
import {apiService} from "./apiService";
import {urls} from "../constants/urls";
import {IRequestConfig, IUser, IUsers} from "../interfaces";


const userService = {
    getAllUsers: (config: IRequestConfig = {},): IRes<IUsers> => {
        return apiService.get(urls.users, {  ...config });
    },
    createUser: (userData: Partial<IUser>): IRes<IUser> => {
        return apiService.post(urls.createUser, userData);

    },
    activateUser: (userId: string, config = {}): IRes<{ activationLink: string }> => {
        return apiService.post(`${urls.usersActivate}`, { userId }, config);
    },
    recoveryPassword: (userId: string, config = {}): IRes<{ activationLink: string }> => {
        return apiService.post(`${urls.recoverPassword}`, { userId }, config);
    },
    banUser: (userId: string, config: IRequestConfig = {}): IRes<void> => {
        return apiService.patch(`${urls.usersBan}/${userId}`, {}, config);
    },
    unbanUser: (userId: string, config: IRequestConfig = {}): IRes<void> => {
        return apiService.patch(`${urls.usersUnBan}/${userId}`, {}, config);
    },
}

export {
    userService
}