import {Outlet} from 'react-router-dom';
import {Auth} from "../components/Auth";

const AuthPage = () => {
    return (
        <div>
            <Auth/>
            <Outlet/>
        </div>
    );
}

export { AuthPage }