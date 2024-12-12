import {Outlet} from "react-router-dom";
import {Users} from "../components/User/Users";
import {Header} from "../components/Header";



const UsersPage = () => {
    return (
        <div>
            <Header/>
            <Users/>
            <Outlet/>
        </div>
    );
};

export {
    UsersPage
}