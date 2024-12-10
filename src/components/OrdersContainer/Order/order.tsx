import React, {FC, PropsWithChildren, useState} from "react";

import {useAppDispatch, useAppSelector} from "../../../hook/reduxHook";
import {UpdateOrder} from "../OrderUpdate/order.update";
import {orderActions} from "../../../store/slices";
import {IOrder} from "../../../interfaces";
import css from "../Orders/orders.module.css";


interface IProps extends PropsWithChildren {
    order: IOrder
}
const Order: FC<IProps> = ({order}) => {
    const dispatch = useAppDispatch();
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [comment, setComment] = useState('');
    const currentUser = useAppSelector((state) => state.auth.user);
    const canAddComment = !order.manager || order.manager === currentUser?.surname;

    const toggleExpand = (id: string) => {setExpandedOrderId((prev) => (prev === id ? null : id));};
    const handleUpdateClick = () => {setIsUpdateModalOpen(true);};
    const handleCloseModal = () => {setIsUpdateModalOpen(false);};
    const handleCommentSubmit = () => {
        if (!canAddComment) {
            alert('You cannot add a comment');
            return;
        }
        const updatedOrder = {
            ...order,
            manager: currentUser?.surname || '',
            status: order.status === null || order.status === 'New' ? 'In Work' : order.status,
            comment: comment,
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

    return (
        <div className={css.Order}>
            <table>
                <tbody>
                <tr className={css.clickableRow} onClick={() => toggleExpand(order._id)}>
                    <td>{order._id.substring(21)}</td>
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
                    <td>{order.created_at}</td>
                    <td>{order.group}</td>
                    <td>{order.manager}</td>
                </tr>
                {expandedOrderId === order._id && (
                    <tr className={css.expandedRow}>
                        <td className={css.qwe} colSpan={15}>
                            <div className={css.details}>
                                <p>msg: {order.msg}</p>
                                <p>utm: {order.utm}</p>
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
                                    <p>This request is already being processed by the manager {order.manager}</p>
                                )}
                                <button onClick={handleUpdateClick}>Update</button>
                            </div>
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
            {isUpdateModalOpen && (
                <div className={css.modalOverlay}>
                    <div className={css.modalContent}>
                        <button onClick={handleCloseModal} className={css.closeButton}>X</button>
                        <UpdateOrder orderId={order._id} closeModal={handleCloseModal}/>
                    </div>
                </div>
            )}
        </div>
    );
};

export {Order};