import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useState} from 'react';

import { AppDispatch } from '../../../store/store';
import {groupActions, orderActions} from "../../../store/slices";
import {RootState} from "../../../types/reduxType";
import {IGroup, IOrder} from "../../../interfaces";
import css from "../OrderUpdate/orderUpdate.module.css";
import {useAppSelector} from "../../../hook/reduxHook";


interface UpdateOrderProps {
    orderId: string;
    closeModal: () => void;
}
const UpdateOrder: React.FC<UpdateOrderProps> = ({ orderId, closeModal }) => {
    const dispatch = useDispatch<AppDispatch>();
    const order = useSelector((state: any) => state.orders.orders.find((o: IOrder) => o._id === orderId));
    const currentUser = useAppSelector((state) => state.auth.user);
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
        user_id: ''

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
        const updatedOrder = {
            ...formData,
            manager: currentUser?._id || formData.manager,
            status: formData.status === null || formData.status === 'New' ? 'InWork' : formData.status,
        };

        dispatch(orderActions.updateOrder({ _id: orderId, updatedOrder }))
            .then(() => {
                alert('Order updated successfully');
                closeModal();
            })
            .catch((error) => {
                console.error('Failed to update order:', error);
                alert('Error updating order');
            });
    };

    return (
        <div className={css.OrdersUpdate}>
            <h3>Update Order</h3>
            <form>
                <div className={css.OrdersUpdateA}>
                    <p>name:</p>
                    <input type="text" name="name" value={formData.name || ''} onChange={handleChange}
                           placeholder="Name"/>
                </div>
                <div className={css.OrdersUpdateA}>
                    <p>surname:</p>
                    <input type="text" name="surname" value={formData.surname || ''} onChange={handleChange}
                           placeholder="Surname"/>
                </div>
                <div className={css.OrdersUpdateA}>
                    <p>email:</p>
                    <input type="email" name="email" value={formData.email || ''} onChange={handleChange}
                           placeholder="Email"/>
                </div>
                <div className={css.OrdersUpdateA}>
                    <p>age:</p>
                    <input type="text" name="age" value={formData.age || ''} onChange={handleChange} placeholder="age"/>
                </div>
                <div className={css.OrdersUpdateA}>
                    <p>course:</p>
                    <select name="course" value={formData.course || ''} onChange={handleChange}>
                        <option value="">Select Course</option>
                        <option value="FS">FS</option>
                        <option value="QACX">QACX</option>
                        <option value="JCX">JCX</option>
                        <option value="JSCX">JSCX</option>
                        <option value="FE">FE</option>
                        <option value="PCX">PCX</option>
                    </select>
                </div>
                <div className={css.OrdersUpdateA}>
                    <p>course_format:</p>
                    <select name="courseFormat" value={formData.course_format || ''} onChange={handleChange}>
                        <option value="">Select courseFormat</option>
                        <option value="online">online</option>
                        <option value="static">static</option>
                    </select>
                </div>
                <div className={css.OrdersUpdateA}>
                    <p>course_type:</p>
                    <select name="courseType" value={formData.course_type || ''} onChange={handleChange}>
                        <option value="">Select courseType</option>
                        <option value="pro">pro</option>
                        <option value="minimal">minimal</option>
                        <option value="premium">premium</option>
                        <option value="incubator">incubator</option>
                        <option value="vip">vip</option>
                    </select>
                </div>
                <div className={css.OrdersUpdateA}>
                    <p>status:</p>
                    <select name="status" value={formData.status || ''} onChange={handleChange}>
                        <option value="">Select status</option>
                        <option value="InWork">InWork</option>
                        <option value="New">New</option>
                        <option value="Aggre">Aggre</option>
                        <option value="Disaggre">Disaggre</option>
                        <option value="Dubbing">Dubbing</option>
                    </select>
                </div>
                <div className={css.OrdersUpdateA}>
                    <p>sum:</p>
                    <input type="text" name="sum" value={formData.sum || ''} onChange={handleChange} placeholder="sum"/>
                </div>
                <div className={css.OrdersUpdateA}>
                    <p>phone:</p>
                    <input type="text" name="phone" value={formData.phone || ''} onChange={handleChange}
                           placeholder="Phone"/>
                </div>
                <div className={css.OrdersUpdateB}>
                    <p>Group:</p>
                    <select name="group" value={formData.group || ''} onChange={handleChange}>
                        <option value="">Select a group</option>
                        {groups.map((group: IGroup) => (
                            <option key={group._id} value={group.name}>{group.name}</option>))}
                    </select>
                    <div className={css.GroupCreate}>
                        <input type="text" placeholder="New group" value={newGroup}
                               onChange={(e) => setNewGroup(e.target.value)}/>
                        <button type="button" onClick={handleAddGroup}>Add a group</button>
                    </div>
                </div>
                <div className={css.OrdersUpdateC}>
                    <button type="button" onClick={handleSave}>Save</button>
                    <button type="button" onClick={closeModal}>Cancel</button>
                </div>

            </form>
        </div>
    );
};
export {
    UpdateOrder
};