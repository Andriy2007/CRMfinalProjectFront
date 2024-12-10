import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from 'react';

import { AppDispatch } from '../../../store/store';
import {groupActions, orderActions} from "../../../store/slices";
import {RootState} from "../../../types/reduxType";
import {IGroup, IOrder} from "../../../interfaces";
import css from "../Orders/orders.module.css";


interface UpdateOrderProps {
    orderId: string;
    closeModal: () => void;
}
const UpdateOrder: React.FC<UpdateOrderProps> = ({ orderId, closeModal }) => {
    const dispatch = useDispatch<AppDispatch>();
    const order = useSelector((state: any) => state.orders.orders.find((o: IOrder) => o._id === orderId));
    const groups = useSelector((state: RootState) => state.groups.groups || []);
    const [newGroup, setNewGroup] = useState('');
    const [formData, setFormData] = useState<IOrder>({
        _id: '',
        name: '',
        surname: '',
        email: '',
        age: '',
        course: '',
        course_format: '',
        course_type: '',
        status: '',
        sum: '',
        phone: 0,
        alreadyPaid: '',
        group: '',
        created_at: '',
        manager: '',
        msg: '',
        utm: '',

    });

    useEffect(() => {
        if (order) {
            setFormData(order);
        } else {
            dispatch(orderActions.getOrdersById(orderId));
        }
    }, [orderId, order, dispatch]);

    useEffect(() => {
        if (groups.length === 0) {
            dispatch(groupActions.getGroups())
        }
    }, [groups, dispatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleAddGroup = () => {
        if (!newGroup.trim()) {
            alert('The group name cannot be empty');
            return;
        }
        const isDuplicate = groups.some((group) => group.name === newGroup);
        if (isDuplicate) {
            alert('A group with that name already exists');
            return;
        }
        dispatch(groupActions.addGroup(newGroup))
            .then(() => {
                dispatch(groupActions.getGroups());
            })
            .catch((error) => console.error('Failed to add group:', error));
        setNewGroup('');
    };

    const handleSave = () => {
        dispatch(orderActions.updateOrder({ _id: orderId, updatedOrder: formData }))
            .then(() => {
                closeModal();
            })
            .catch((error) => {
                console.error('Failed to update order:', error);
            });
    };

    return (
        <div className={css.OrdersUpdate}>
            <h3>Update Order</h3>
            <form>
                <input type="text" name="name" value={formData.name || ''} onChange={handleChange} placeholder="Name"/>
                <input type="text" name="surname" value={formData.surname || ''} onChange={handleChange} placeholder="Surname"/>
                <input type="email" name="email" value={formData.email || ''} onChange={handleChange} placeholder="Email"/>
                <input type="text" name="age" value={formData.age || ''} onChange={handleChange} placeholder="age"/>
                <input type="text" name="course" value={formData.course || ''} onChange={handleChange} placeholder="course"/>
                <input type="text" name="course_format" value={formData.course_format || ''} onChange={handleChange} placeholder="course_format"/>
                <input type="text" name="course_type" value={formData.course_type || ''} onChange={handleChange} placeholder="course_type"/>
                <input type="text" name="status" value={formData.status || ''} onChange={handleChange} placeholder="status"/>
                <input type="text" name="sum" value={formData.sum || ''} onChange={handleChange} placeholder="sum"/>
                <input type="text" name="phone" value={formData.phone || ''} onChange={handleChange} placeholder="Phone"/>
                <select name="group" value={formData.group || ''} onChange={handleChange}><option value="">Select a group</option>
                    {groups.map((group: IGroup) => (<option key={group._id} value={group.name}>{group.name}</option>))}
                </select>
                <div><input type="text" placeholder="New group" value={newGroup} onChange={(e) => setNewGroup(e.target.value)}/>
                    <button type="button" onClick={handleAddGroup}>Add a group</button>
                </div>
                <input type="text" name="created_at" value={formData.created_at || ''} onChange={handleChange} placeholder="created_at"/>
                <input type="text" name="manager" value={formData.manager || ''} onChange={handleChange} placeholder="manager"/>
                <input type="text" name="msg" value={formData.msg || ''} onChange={handleChange} placeholder="msg"/>
                <input type="text" name="utm" value={formData.utm || ''} onChange={handleChange} placeholder="utm"/>
                <button type="button" onClick={handleSave}>Save</button>
                <button type="button" onClick={closeModal}>Cancel</button>
            </form>
        </div>
    );
};
export {UpdateOrder};