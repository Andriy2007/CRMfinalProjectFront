import React, {FC, PropsWithChildren} from 'react';

import {IUser} from "../../interfaces";
import css from './User.module.css';


interface IProps extends PropsWithChildren {
    user: IUser
}
const User: FC<IProps> = ({user}) => {
    const {name,_id} = user;

    return (
        <div className={css.User}>
            <div>{user.name}</div>
        </div>
    );
};

export {User};