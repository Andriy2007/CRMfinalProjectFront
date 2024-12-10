import {IRes} from "../types/responceType";
import {apiService} from "./apiService";
import {urls} from "../constants/urls";
import {IRequestConfig, IUsers} from "../interfaces";


const userService = {
    getAllUsers: (config: IRequestConfig = {},): IRes<IUsers> => {
        return apiService.get(urls.users, {  ...config });
    }
}

export {
    userService
}