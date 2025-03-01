import React, {FC, PropsWithChildren, useEffect, useRef, useState} from "react";

import {useAppDispatch, useAppSelector} from "../../../hook/reduxHook";
import {UpdateOrder} from "../OrderUpdate/order.update";
import {orderActions, userActions} from "../../../store/slices";
import {IOrder, IUser} from "../../../interfaces";
import css from "../Order/order.module.css";
import {usePageQuery} from "../../../hook/usePageQuery";


interface IProps extends PropsWithChildren {
    order: IOrder
    expandedOrderId: string | null;
    toggleExpand: (id: string) => void;
    index: number;
}
const Order: FC<IProps> = ({ order, expandedOrderId, toggleExpand, index }) => {
    const dispatch = useAppDispatch();
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const { orders, statistics, } = useAppSelector(state => state.orders);
    const { page, setPage, prevPage, nextPage } = usePageQuery();
    const { total, limit } = statistics;
    const [comment, setComment] = useState('');
    const currentUser = useAppSelector((state) => state.auth.user);
    const canAddComment = !order.manager || order.manager === currentUser?._id;
    const canUpdateOrder = !order.manager || order.manager === currentUser?._id;
    const { users } = useAppSelector((state) => state.users);

    const handleCommentSubmit = () => {
        if (!canAddComment) {
            alert('You cannot add a comment');
            return;
        }
        const updatedOrder = {
            ...order,
            manager: currentUser?._id || '',
            status: order.status === null || order.status === 'New' ? 'In Work' : order.status,
            comment: {
                text: comment,
                author: currentUser?.surname || 'Unknown',
                date: new Date().toISOString().substring(0, 10),
            },
        };
        dispatch(orderActions.updateOrder({ _id: order._id, updatedOrder }))
            .then(() => {
                alert('Comment added');
                setComment('');
            })
            .catch((error) => {
                console.error('Failed to update order:', error);
                alert('Error adding comment');
            });
    };

    const getManagerName = (managerId: string) => {
        const manager = users.find((user: IUser) => user._id === managerId);
        return manager ? `${manager.name} ${manager.surname}` : managerId;
    };

    return (
        <div className={css.Order}>
            <table>
                <tbody>
                <tr className={css.clickableRow} onClick={() => toggleExpand(order._id)}>
                    <td>{(page - 1) * limit + index + 1}</td>
                    <td>{order.name}</td>
                    <td>{order.surname}</td>
                    <td>{order.email}</td>
                    <td>{order.age}</td>
                    <td>{order.phone}</td>
                    <td>{order.course}</td>
                    <td>{order.course_format}</td>
                    <td>{order.course_type}</td>
                    <td>{order.status}</td>
                    <td>{order.sum}</td>
                    <td>{order.alreadyPaid}</td>
                    <td>{order.created_at
                        ? new Date(order.created_at).toLocaleDateString('uk-UA', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                        })
                        : ' '}
                    </td>
                    <td>{order.group}</td>
                    <td>{getManagerName(order.manager)}</td>
                </tr>
                {expandedOrderId === order._id && (
                    <tr className={css.expandedRow}>
                        <td className={css.qwe} colSpan={15}>
                            <div className={css.details}>
                                <p>msg: {order.msg}</p>
                                <p>utm: {order.utm}</p>
                            </div>
                            <div className={css.commentSectionm}>
                                {order.comment && (
                                    <div className={css.commentDisplay}>
                                        <p>Comment: {order.comment.text}</p>
                                        <p>Author: {order.comment.author}</p>
                                        <p>Date: {order.comment.date}</p>
                                    </div>
                                )}
                                {canAddComment && (
                                    <div className={css.commentSection}>
                                            <textarea
                                                placeholder="Enter your comment"
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                            />
                                        <button onClick={handleCommentSubmit}>Add a comment</button>
                                    </div>
                                )}
                                {!canAddComment && (
                                    <p>This request is already being processed by the manager {getManagerName(order.manager)}</p>
                                )}
                            </div>
                            {canUpdateOrder ? (
                                <button onClick={() => setIsUpdateModalOpen(true)}>Update</button>
                            ) : (
                                <p>This order can only be updated by {getManagerName(order.manager)}</p>
                            )}
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
            {isUpdateModalOpen && (
                <div className={css.modalOverlay}>
                    <div className={css.modalContent}>
                        <button onClick={() => setIsUpdateModalOpen(false)} className={css.closeButton}>X</button>
                        <UpdateOrder orderId={order._id} closeModal={() => setIsUpdateModalOpen(false)} />
                    </div>
                </div>
            )}
        </div>
    );
};













export {Order};