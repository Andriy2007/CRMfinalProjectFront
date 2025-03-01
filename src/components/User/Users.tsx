import React, {useEffect, useState} from "react";

import {useAppDispatch, useAppSelector} from "../../hook/reduxHook";
import {orderActions, userActions} from "../../store/slices";
import css from './User.module.css';
import {useNavigate} from "react-router-dom";



const Users = () => {
    const { users } = useAppSelector(state => state.users);
    const { statistics, userStatistics } = useAppSelector(state => state.orders);
    const { isAuthenticated } = useAppSelector(state => state.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: "", surname: "", email: "",role: "Manager", });

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate('/logIn');
        } else {
            dispatch(userActions.getAllUsers());
            dispatch(orderActions.getAllOrders({
                page: '',
                limit: '1000',
                course_format: '',
                course: '',
                course_type: '',
                status: '',
                searchByName: '',
                searchBySurname: '',
                searchByEmail: '',
                searchByPhone: '',
                searchByAge: '',
                order: '',
                orderBy: '',
            }));
        }
    }, [dispatch]);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/logIn');
        }
    }, [isAuthenticated, navigate]);

    const handleCreate = async () => {
        try {
            const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
            if (!emailRegex.test(formData.email)) {
                alert("Неправильний формат email");
                return;
            }
            const { role, ...requestData } = formData;
            await dispatch(userActions.createUser(requestData)).unwrap();
            await dispatch(userActions.getAllUsers());
            setIsModalOpen(false);
        } catch (error: any) {
            if (error && error.message && error.message.includes("already exists")) {
            } else {
                alert("Такий email вже використовується");
            }
        }
    };


    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleActivate = async (userId: string) => {
        try {
            await dispatch(userActions.activateUser(userId));
            alert('Activation link copied to clipboard!');
        } catch (error) {
            console.error('Error generating activation link:', error);
            alert('Failed to generate activation link');
        }
    };

    const handleBanUser = async (userId: string) => {
        try {
            await dispatch(userActions.banUser(userId));
            alert('User has been banned!');
        } catch (error) {
            console.error('Error banning user:', error);
            alert('Failed to ban user');
        }
    };

    const handleUnbanUser = async (userId: string) => {
        try {
            await dispatch(userActions.unbanUser(userId));
            alert('User has been unbanned!');
        } catch (error) {
            console.error('Error unbanning user:', error);
            alert('Failed to unban user');
        }
    };
    const handleRecoveryPassword = async (userId: string) => {
        try {
            await dispatch(userActions.activateUser(userId));
            alert('Activation link copied to clipboard!');
        } catch (error) {
            console.error('Error generating activation link:', error);
            alert('Failed to generate activation link');
        }
    };

    return (
        <div>
            <div className={css.statistic}>
                <h3>Order Statistics</h3>
                <p>Total Orders: {statistics.total}</p>
                <ul>
                    {Object.entries(statistics.statusCounts).map(([status, count]) => (
                        <li key={status}>{status}: {count}
                        </li>
                    ))}
                </ul>
            </div>

            <div className={css.createUser}>
                <button onClick={() => setIsModalOpen(true)}>Create User</button>
            </div>
            {isModalOpen && (
                <div className={css.modalOverlay}>
                    <div className={css.modalContent}>
                        <button onClick={handleCloseModal} className={css.closeButton}>X</button>
                        <h3>Create Manager</h3>
                        <input
                            placeholder="Name"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                        />
                        <input
                            placeholder="Surname"
                            value={formData.surname}
                            onChange={e => setFormData({ ...formData, surname: e.target.value })}
                        />
                        <input
                            placeholder="Email"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                        <button onClick={handleCreate}>Submit</button>
                    </div>
                </div>
            )}

            <div className={css.Users}>
                {users?.length > 0 && users.map(user => (
                    <div key={user._id} className={css.userBlock}>
                        <div className={css.UserInfo}>
                            <p>id: {user._id}</p>
                            <p>name: {user.name}</p>
                            <p>surname: {user.surname}</p>
                            <p>email: {user.email}</p>
                        </div>
                        <div className={css.userStatistics}>
                            <p>Total Orders: {userStatistics[user._id]?.total || 0}</p>
                            <ul>
                                {userStatistics[user._id] &&
                                    Object.entries(userStatistics[user._id].statusCounts).map(([status, count]) => (
                                        <li key={status}>
                                            {status}: {count}
                                        </li>
                                    ))}
                            </ul>
                        </div>
                        <div className={css.userButtons}>
                            <button
                                onClick={() => handleActivate(user._id)}
                                disabled={user.isVerified}
                            >
                                Activate
                            </button>
                            <button onClick={() => handleRecoveryPassword(user._id)}>
                                Recover Password
                            </button>
                            <button onClick={() => handleBanUser(user._id)} disabled={user.isBanned}>
                                Ban
                            </button>
                            <button onClick={() => handleUnbanUser(user._id)} disabled={!user.isBanned}>
                                Unban
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export {
    Users
}