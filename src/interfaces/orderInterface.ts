export interface IOrders {
    page: number,
    "total_pages": number,
    "total_results": number
    results: IOrder[],
    data: IOrder[];
}
export interface IOrder {
    _id: string;
    name: string;
    surname: string;
    email: string;
    age: string;
    course: string;
    course_format: string;
    course_type: string;
    status: string;
    sum: string;
    phone: number;
    alreadyPaid: string;
    group: string;
    created_at: string;
    manager: string;
    msg: string;
    utm: string;
}