import {urls} from "../constants/urls";
import {apiService} from "./apiService";
import {IRes} from "../types/responceType";
import {IOrder, IOrders, IRequestConfig} from "../interfaces";



const ordersService = {
    getAllOrders: (page: string,limit: string, config: IRequestConfig = {}, course_format?: string, course?: string, course_type?: string, status?: string,group?: string, searchByName?: string,
                   searchBySurname?: string, searchByEmail?: string, searchByPhone?: string, searchByAge?: string,startDate?: string,endDate?: string, order?: string, orderBy?: string,)
        : IRes<IOrders> => {
        const params = {page,limit, course_format, course, course_type, status,group, searchByName, searchBySurname, searchByEmail,
            searchByPhone, searchByAge, startDate, order, endDate, orderBy,};
        const filteredParams = Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== undefined && value !== null && value !== ''));
        return apiService.get(urls.orders, { params: filteredParams, ...config });
        },
    getOrdersById: (_id: string): IRes<IOrder> => apiService.get(`${urls.orders}/${_id}`),

};

export {
    ordersService
}