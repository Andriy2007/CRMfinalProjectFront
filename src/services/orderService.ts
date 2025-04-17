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

    exportOrdersToExcel: async (page?: string, limit?: string, course_format?: string, course?: string, course_type?: string, status?: string, group?: string,
                                searchByName?: string, searchBySurname?: string, searchByEmail?: string, searchByPhone?: string, searchByAge?: string, startDate?: string, endDate?: string, order?: string, orderBy?: string
    ) => {
        const params = {page, limit, course_format, course, course_type, status, group, searchByName, searchBySurname, searchByEmail,
            searchByPhone, searchByAge, startDate, endDate, order, orderBy,};
        const filteredParams = Object.fromEntries(
            Object.entries(params).filter(([_, value]) => value !== undefined && value !== null && value !== '')
        );
        const response = await apiService.get(urls.exportOrders, {
            params: filteredParams,
            responseType: 'blob',
        });
        const blob = new Blob([response.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'orders.xlsx');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }
};

export {
    ordersService
}