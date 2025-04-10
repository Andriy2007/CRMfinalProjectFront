import React, {useEffect, useState} from "react";

import {useAppDispatch, useAppSelector} from "../../hook/reduxHook";
import {orderActions, userActions} from "../../store/slices";
import css from './User.module.css';
import {useNavigate, useSearchParams} from "react-router-dom";
import {generatePageNumbers, usePageQuery} from "../../hook/usePageQuery";



const Users = () => {
    const { users } = useAppSelector(state => state.users);
    const { statistics, userStatistics } = useAppSelector(state => state.orders);
    const { page, setPage, prevPage, nextPage } = usePageQuery();
    const [searchParams, setSearchParams] = useSearchParams();
    const { total, limit } = useAppSelector(state => state.users);
    const totalPages = limit > 0 ? Math.ceil(total / limit) : 1;
    const { isAuthenticated } = useAppSelector(state => state.auth);
    const { user: authUser } = useAppSelector(state => state.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: "", surname: "", email: "",role: "Manager", });
    const pageNumbers = generatePageNumbers(page, totalPages);
    useEffect(() => {
        if (isAuthenticated) {
            dispatch(userActions.getAllUsers({page, limit: 4}));
            dispatch(orderActions.getAllOrders({
                page: '1',
                limit: '1000',
                course_format: '',
                course: '',
                course_type: '',
                status: '',
                group: '',
                searchByName: '',
                searchBySurname: '',
                searchByEmail: '',
                searchByPhone: '',
                searchByAge: '',
                startDate: '',
                endDate: '',
                order: '',
                orderBy: '',
            }));
        }
    }, [isAuthenticated, searchParams, dispatch]);

    const handleCreate = async () => {
        try {
            const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
            if (!emailRegex.test(formData.email)) {
                alert("Неправильний формат email");
                return;
            }
            const { role, ...requestData } = formData;
            await dispatch(userActions.createUser(requestData)).unwrap();
            await dispatch(userActions.getAllUsers({ page, limit: 4 }));
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

    const handleNextPage = () => {
        nextPage(totalPages);
        dispatch(userActions.getAllUsers({ page: page + 1, limit: 4 }));
    };

    return (
        <div>
            <div className={css.statistic}>
                <h3>Order Statistics</h3>
                <p>Total Orders: {statistics.total}</p>
                <ul>
                    {statistics?.statusCounts && Object.entries(statistics.statusCounts).map(([status, count], index) => (
                        <li key={`${status}-${index}`}>{status}: {count}</li>
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
                            onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                        <input
                            placeholder="Surname"
                            value={formData.surname}
                            onChange={e => setFormData({...formData, surname: e.target.value})}
                        />
                        <input
                            placeholder="Email"
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                        <button onClick={handleCreate}>Submit</button>
                    </div>
                </div>
            )}

            <div className={css.Users}>
                {users?.length > 0 && users.map((user, index) => (
                    <div key={user._id || index} className={css.userBlock}>
                        <div className={css.UserInfo}>
                            <p>id: {user._id}</p>
                            <p>name: {user.name}</p>
                            <p>surname: {user.surname}</p>
                            <p>email: {user.email}</p>
                        </div>
                        <div className={css.userStatistics}>
                            <p>Total Orders: {userStatistics[user._id]?.total || 0}</p>
                            <ul>
                                {userStatistics[user._id]?.statusCounts &&
                                    Object.entries(userStatistics[user._id].statusCounts).map(([status, count], index) => (
                                        <li key={`${status}-${user._id}-${index}`}>{status}: {count}</li>
                                    ))}
                            </ul>
                        </div>
                        <div className={css.userButtons}>
                            {user.role !== 'ADMIN' && authUser?._id !== user._id && (
                                <>
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
                                </>
                            )}
                            {authUser?._id === user._id && user.role !== 'ADMIN' && (
                                <button onClick={() => handleRecoveryPassword(user._id)}>
                                    Recover Password
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <div className={css.pag}>
                <div className={css.pag}>
                    <button onClick={prevPage} disabled={page === 1}>{`<<`}</button>
                    {pageNumbers.map((pageNum, index) => (
                        typeof pageNum === 'number' ? (
                            <button
                                key={index}
                                onClick={() => setPage(pageNum)}
                                className={pageNum === page ? css.activePage : ''}
                            >
                                {pageNum}
                            </button>
                        ) : (
                            <button
                                key={index}
                                onClick={() => {
                                }}
                                className={css.dotsButton}
                                disabled
                            >
                                {pageNum}
                            </button>
                        )
                    ))}
                    <button onClick={() => nextPage(totalPages)} disabled={page === totalPages}>{`>>`}</button>
                </div>
            </div>

        </div>
    );
};


export {
    Users
}