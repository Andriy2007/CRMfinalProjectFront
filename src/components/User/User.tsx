import React, {FC, PropsWithChildren} from 'react';

import {IUser} from "../../interfaces";
import css from './User.module.css';


interface IProps extends PropsWithChildren {
    user: IUser
}
const User: FC<IProps> = ({user}) => {
    const {name,_id,email,surname} = user;

    return (

        <div className={css.User}>
            <div>id:{user._id}</div>
            <div>email:{user.email}</div>
            <div>name:{user.name}</div>
            <div>surname:{user.surname}</div>

        </div>
    );
};

export {User};