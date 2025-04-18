import React, {useEffect, useState} from 'react';
import {useDispatch} from "react-redux";
import { useNavigate } from 'react-router-dom';

import {urls} from "../../constants/urls";
import {authActions} from "../../store/slices";
import {AuthProps} from "../../interfaces";
import {apiService} from "../../services";
import css from './Auth.module.css';


const Auth: React.FC<AuthProps> = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            navigate('/orders', { replace: true });
        }
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Invalid email');
            return;
        }
        try {
            const response = await apiService.post(
                `${urls.logIn}`,
                { email, password },
                { withCredentials: true }
            );
            if (response.data.tokens && response.data.tokens.accessToken) {
                localStorage.setItem("accessToken", response.data.tokens.accessToken);
                localStorage.setItem("refreshToken", response.data.tokens.refreshToken);
                dispatch(authActions.loginSuccess({ user: response.data.user }));
                navigate('/orders', { replace: true });
            } else {
                console.error('Invalid email or password');
            }
        } catch (err) {
            setError('Invalid email or password');
            console.error(err);
        }
    };

    return (
        <div className={css.loGiN}>
            <div className={css.box}>
                <div className={css.head}>
                    <h1>Вхід в особостий кабінет</h1>
                </div>
                <div className={css.blank}>
                    <form onSubmit={handleSubmit}>
                        <label>EMAIL</label>
                        <input type="email" placeholder={`qwerty@gmail.com`} value={email}
                               onChange={(e) => setEmail(e.target.value)} required/>
                        <label>PASSWORD</label>
                        <input type="password" placeholder={`password`} value={password}
                               onChange={(e) => setPassword(e.target.value)} required/>
                        <div className={css.footer}>
                            {error && <h3 style={{color: 'red'}}>{error}</h3>}
                           <div> <button type="submit">Увійти</button></div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
export {
    Auth
}