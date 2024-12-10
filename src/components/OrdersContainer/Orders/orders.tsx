import React, {useEffect, useState} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';

import {useAppDispatch, useAppSelector} from "../../../hook/reduxHook";
import {usePageQuery} from "../../../hook/usePageQuery";
import {Order} from "../Order/order";
import {orderActions} from "../../../store/slices";
import css from "./orders.module.css";


const Orders = () => {
    const { orders } = useAppSelector(state => state.orders);
    const { isAuthenticated } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { page, prevPage, nextPage } = usePageQuery();
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedCourse, setSelectedCourse] = useState(searchParams.get('course') || 'Toggle Course');
    const [selectedCourseFormat, setSelectedCourseFormat] = useState(searchParams.get('course_format') || 'Toggle Course Format');
    const [selectedCourseType, setSelectedCourseType] = useState(searchParams.get('course_type') || 'Toggle Course Type');
    const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || 'Toggle Status');
    const [sortField, setSortField] = useState(searchParams.get('orderBy') || 'age');
    const [sortOrder, setSortOrder] = useState(searchParams.get('order') || 'asc');
    const sortableFields = [
        '_id', 'name', 'surname', 'email', 'age', 'phone',
        'course', 'course_format', 'course_type', 'status',
        'sum', 'alreadyPaid',  'created_at','group', 'manager'
    ];
    const filters = [
        { key: 'searchByName', label: 'Name' },
        { key: 'searchBySurname', label: 'Surname' },
        { key: 'searchByEmail', label: 'Email' },
        { key: 'searchByPhone', label: 'Phone' },
        { key: 'searchByAge', label: 'Age' }
    ];
    const [dropdownState, setDropdownState] = useState({
        course: false,
        courseFormat: false,
        courseType: false,
        status: false,
        course_format: false,
    });
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate('/logIn');
        } else {
            const params = Object.fromEntries(searchParams.entries());
            dispatch(orderActions.getAllOrders({
                page: params.page || "1",
                course_format: params.course_format || "",
                course: params.course || "",
                course_type: params.course_type || "",
                status: params.status || "",
                searchByName: params.searchByName || "",
                searchBySurname: params.searchBySurname || "",
                searchByEmail: params.searchByEmail || "",
                searchByPhone: params.searchByPhone || "",
                searchByAge: params.searchByAge || "",
                order: params.order || "",
                orderBy: params.orderBy || ""
            }));
        }
    }, [isAuthenticated, searchParams, dispatch]);
    const toggleSortOrder = (field: string) => {
        const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        setSortOrder(newOrder);
        setSortField(field);
        const newParams = new URLSearchParams(searchParams);
        newParams.set('orderBy', field);
        newParams.set('order', newOrder);
        setSearchParams(newParams);
    };
    const updateFilter = (key: string, value: string) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        setSearchParams(newParams);
        if (key === 'course') {
            setSelectedCourse(value || 'Toggle Course');
            setDropdownState((prevState) => ({ ...prevState, course: false }));
        }
        if (key === 'course_format') {
            setSelectedCourseFormat(value || 'Toggle Course Format');
            setDropdownState((prevState) => ({ ...prevState, courseFormat: false }));
        }
        if (key === 'course_type') {
            setSelectedCourseType(value || 'Toggle Course Type');
            setDropdownState((prevState) => ({ ...prevState, courseType: false }));
        }
        if (key === 'status') {
            setSelectedStatus(value || 'Toggle Status');
            setDropdownState((prevState) => ({ ...prevState, status: false }));
        }
    };
    const toggleDropdown = (key: keyof typeof dropdownState) => {
        setDropdownState(prevState => ({
            ...prevState,
            [key]: !prevState[key],
        }));
    };
    const resetFilters = () => {
        setSearchParams(new URLSearchParams());
        setSelectedCourse('Toggle Course');
        setSelectedCourseFormat('Toggle Course Format');
        setSelectedCourseType('Toggle Course Type');
        setSelectedStatus('Toggle Status');
        setSortField('age');
        setSortOrder('asc');
    };

    return (
        <div className={css.Orders}>
            <div className={css.filtersTop}>
                {filters.map(filter => (
                    <div  key={filter.key} className={css[`filter${filter.key}`]}>
                        <input
                            type="text"
                            placeholder={`Search by ${filter.label}`}
                            value={searchParams.get(filter.key) || ''}
                            onChange={(e) => updateFilter(filter.key, e.target.value)}
                        />
                    </div>))}
            </div>
            <div className={css.filtersBot}>
                <div className={css.filters7}>
                    <button onClick={() => toggleDropdown('course')}>{selectedCourse}</button>
                    {dropdownState.course && (
                        <div className={css.dropdownContent}>
                            <button onClick={() => updateFilter('course', 'FS')}>FS</button>
                            <button onClick={() => updateFilter('course', 'QACX')}>QACX</button>
                            <button onClick={() => updateFilter('course', 'JCX')}>JCX</button>
                            <button onClick={() => updateFilter('course', 'JSCX')}>JSCX</button>
                            <button onClick={() => updateFilter('course', 'FE')}>FE</button>
                            <button onClick={() => updateFilter('course', 'PCX')}>PCX</button>
                            <button onClick={() => updateFilter('course', '')}>Clear Course</button>
                        </div>)}
                </div>
                <div className={css.filters8}>
                    <button onClick={() => toggleDropdown('courseFormat')}>{selectedCourseFormat}</button>
                    {dropdownState.courseFormat && (
                        <div className={css.dropdownContent}>
                            <button onClick={() => updateFilter('course_format', 'online')}>Online</button>
                            <button onClick={() => updateFilter('course_format', 'static')}>Static</button>
                            <button onClick={() => updateFilter('course_format', '')}>Clear Format</button>
                        </div>)}
                </div>
                <div className={css.filters9}>
                    <button onClick={() => toggleDropdown('courseType')}>{selectedCourseType}</button>
                    {dropdownState.courseType && (
                        <div className={css.dropdownContent}>
                            <button onClick={() => updateFilter('course_type', 'pro')}>pro</button>
                            <button onClick={() => updateFilter('course_type', 'minimal')}>minimal</button>
                            <button onClick={() => updateFilter('course_type', 'premium')}>premium</button>
                            <button onClick={() => updateFilter('course_type', 'incubator')}>incubator</button>
                            <button onClick={() => updateFilter('course_type', 'vip')}>vip</button>
                            <button onClick={() => updateFilter('course_type', '')}>Clear Type</button>
                        </div>)}
                </div>
                <div className={css.filters10}>
                    <button onClick={() => toggleDropdown('status')}>{selectedStatus}</button>
                    {dropdownState.status && (
                        <div className={css.dropdownContent}>
                            <button onClick={() => updateFilter('status', 'In work')}>In work</button>
                            <button onClick={() => updateFilter('status', 'New')}>New</button>
                            <button onClick={() => updateFilter('status', '')}>Clear Status</button>
                        </div>)}
                </div>
                <div className={css.filters11}>
                    <button className={css.resetButton} onClick={resetFilters}>Reset Filters</button>
                </div>
            </div>
            <div className={css.filtersOrder}>
                <table>
                    <thead>
                    <tr>
                        {sortableFields.map(field => (
                            <th key={field}>
                                <button className={css.sortButton} onClick={() => toggleSortOrder(field)}>
                                    {field}
                                    {sortField === field && (
                                        <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                                    )}
                                </button>
                            </th>))}
                        </tr>
                    </thead>
                </table>
            </div>
            <div className={css.zxc}>{orders.map(order => (<Order key={order._id} order={order}/>))}
            </div>
            <div className={css.pag}>
                <button onClick={prevPage}> {`<<`} </button>
                <h5 className={css.Page}> Page: {page}</h5>
                <button onClick={nextPage}> {`>>`} </button>
            </div>
        </div>
    );
};

export {Orders};