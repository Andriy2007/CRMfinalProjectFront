import {IRes} from "../types/responceType";
import {apiService} from "./apiService";
import {urls} from "../constants/urls";
import {IRequestConfig, IUser, IUsers} from "../interfaces";


const userService = {
    getAllUsers: (params: { page: number, limit: number },config: IRequestConfig = {},): IRes<IUsers> => {
        return apiService.get(urls.users, {  ...config, params  });
    },
    createUser: (userData: Partial<IUser>): IRes<IUser> => {
        return apiService.post(urls.createUser, userData);
    },
    setPassword: (token: string, password: string): IRes<void> => {
        return apiService.post(urls.creatPassword, { token, password ,confirmPassword: password});
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