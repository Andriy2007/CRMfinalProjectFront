import {useEffect} from "react";

import {useAppDispatch, useAppSelector} from "../../hook/reduxHook";
import {userActions} from "../../store/slices";
import {User} from "./User";
import css from './User.module.css';


const Users = () => {
    const {users} = useAppSelector(state => state.users);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(userActions.getAllUsers())
    }, [dispatch])

    if (!Array.isArray(users)) {
        return <div>Loading...</div>;
    }

    return (
            <div className={css.Genres}>
                {users.map(user => <User key={user._id} user={user}/>)}
            </div>
    );
};
export {
    Users
}