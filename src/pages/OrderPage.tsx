import {Outlet} from "react-router-dom";
import {Orders} from "../components/OrdersContainer";
import {Header} from "../components/Header";

const OrdersPage = () => {
    return (
        <div>
            <Header/>
            <Orders/>
            <Outlet/>
        </div>
    );
};

export {
    OrdersPage
}