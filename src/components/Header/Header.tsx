import {NavLink} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";

import {authActions} from "../../store/slices";
import css from './Header.module.css';


const Header = () => {
    const { user, isAuthenticated } = useSelector((state: any) => state.auth);
    const dispatch = useDispatch()

    const handleLogout = () => {
        dispatch(authActions.logout());
    };

    return (
        <div className={css.Header}>
            <h2 className={css.Logo}>{isAuthenticated && user ? `Welcome, ${user.name}` : 'LOGO'}</h2>
            <div className={css.header}><NavLink to={isAuthenticated ? '/orders' : '/logIn'}>Orders</NavLink></div>
            <div className={css.header}><NavLink to={isAuthenticated ? '/users' : '/logIn'}>Users</NavLink></div>
            <div className={css.footer}><button onClick={handleLogout}>Logout</button></div>
        </div>
    );
};

export {
    Header
}