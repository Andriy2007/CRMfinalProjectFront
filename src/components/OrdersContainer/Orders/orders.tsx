import React, {useCallback, useEffect, useState} from 'react';
import {useSearchParams} from 'react-router-dom';

import {useAppDispatch, useAppSelector} from "../../../hook/reduxHook";
import {generatePageNumbers, usePageQuery} from "../../../hook/usePageQuery";
import {Order} from "../Order/order";
import {groupActions, orderActions, userActions} from "../../../store/slices";
import css from "./orders.module.css";
import {debounce} from "../../../hook/debounce";
import {useSelector} from "react-redux";
import {RootState} from "../../../types/reduxType";
import {IGroup} from "../../../interfaces";
import {ordersService} from "../../../services";


const Orders = () => {
    const { orders, statistics, } = useAppSelector(state => state.orders);
    const { isAuthenticated } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const { page, setPage, prevPage, nextPage } = usePageQuery();
    const { total, limit } = statistics;
    const groups = useSelector((state: RootState) => state.groups.groups || []);
    const totalPages = limit > 0 ? Math.ceil(total / limit) : 1;
    const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedCourse, setSelectedCourse] = useState(searchParams.get('course') || 'Toggle Course');
    const [selectedCourseFormat, setSelectedCourseFormat] = useState(searchParams.get('course_format') || 'Toggle Course Format');
    const [selectedCourseType, setSelectedCourseType] = useState(searchParams.get('course_type') || 'Toggle Course Type');
    const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || 'Toggle Status');
    const [selectedGroups, setSelectedGroups] = useState(searchParams.get('groups') || 'Toggle Groups');
    const [startDate, setStartDate] = useState(searchParams.get('startDate') || '');
    const [endDate, setEndDate] = useState(searchParams.get('endDate') || '');
    const [sortField, setSortField] = useState(searchParams.get('orderBy') || 'age');
    const [sortOrder, setSortOrder] = useState(searchParams.get('order') || 'asc');
    type FilterKey = 'searchByName' | 'searchBySurname' | 'searchByEmail' | 'searchByPhone' | 'searchByAge' | 'startDate' | 'endDate';
    const [localSearchValues, setLocalSearchValues] = useState<Record<FilterKey, string>>({
        searchByName: searchParams.get('searchByName') || '',
        searchBySurname: searchParams.get('searchBySurname') || '',
        searchByEmail: searchParams.get('searchByEmail') || '',
        searchByPhone: searchParams.get('searchByPhone') || '',
        searchByAge: searchParams.get('searchByAge') || '',
        startDate: searchParams.get('startDate') || '',
        endDate: searchParams.get('endDate') || '',
    });
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
        { key: 'searchByAge', label: 'Age' },
        { key: 'startDate', label: 'startDate' },
        { key: 'endDate', label: 'endDate' }
    ];
    const [dropdownState, setDropdownState] = useState({
        course: false,
        courseFormat: false,
        courseType: false,
        status: false,
        course_format: false,
        group: false,
    });
    const pageNumbers = generatePageNumbers(page, totalPages);
    useEffect(() => {
        if (isAuthenticated) {
            const params = Object.fromEntries(searchParams.entries());
            dispatch(userActions.getAllUsers({ page: 1, limit: 1000 }));
            dispatch(orderActions.getAllOrders({
                page: params.page || "1",
                limit: params.limit || "20",
                course_format: params.course_format || "",
                course: params.course || "",
                course_type: params.course_type || "",
                status: params.status || "",
                group: params.group || "",
                searchByName: params.searchByName || "",
                searchBySurname: params.searchBySurname || "",
                searchByEmail: params.searchByEmail || "",
                searchByPhone: params.searchByPhone || "",
                searchByAge: params.searchByAge || "",
                startDate: params.startDate || "",
                endDate: params.endDate || "",
                order: params.order || "",
                orderBy: params.orderBy || ""
            }));
        }
    }, [isAuthenticated, searchParams, dispatch]);
    useEffect(() => {
        if (groups.length === 0) {
            dispatch(groupActions.getGroups())
        }
    }, [groups, dispatch]);
    const toggleSortOrder = (field: string) => {
        const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        setSortOrder(newOrder);
        setSortField(field);
        const newParams = new URLSearchParams(searchParams);
        newParams.set('orderBy', field);
        newParams.set('order', newOrder);
        newParams.set('page', '1');
        setSearchParams(newParams);
    };
    const updateFilter = (key: string, value: string) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        newParams.set('page', '1');
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
        if (key === 'group') {
            setSelectedGroups(value || 'Toggle Group');
            setDropdownState((prevState) => ({ ...prevState, group: false }));
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
        setSelectedGroups('Toggle Group');
        setSortField('age');
        setSortOrder('asc');
        setLocalSearchValues({
            searchByName: '',
            searchBySurname: '',
            searchByEmail: '',
            searchByPhone: '',
            searchByAge: '',
            startDate: '',
            endDate: '',
        });
    };
    const debouncedUpdateFilter = useCallback(debounce((newParams: URLSearchParams) => {
        setSearchParams(newParams);
    }, 1000), []);

    const updateSearchFilter = (key: FilterKey, value: string) => {
        setLocalSearchValues(prevState => {
            const updatedValues = { ...prevState, [key]: value };
            const newParams = new URLSearchParams();
            Object.keys(updatedValues).forEach(k => {
                if (updatedValues[k as FilterKey] && updatedValues[k as FilterKey] !== 'Toggle Course' && updatedValues[k as FilterKey] !== 'Toggle Course Format' && updatedValues[k as FilterKey] !== 'Toggle Course Type' && updatedValues[k as FilterKey] !== 'Toggle Status' && updatedValues[k as FilterKey] !== 'Toggle Group') {
                    newParams.set(k as FilterKey, updatedValues[k as FilterKey]);
                }
            });
            if (selectedCourse && selectedCourse !== 'Toggle Course') {
                newParams.set('course', selectedCourse);
            }
            if (selectedCourseFormat && selectedCourseFormat !== 'Toggle Course Format') {
                newParams.set('course_format', selectedCourseFormat);
            }
            if (selectedCourseType && selectedCourseType !== 'Toggle Course Type') {
                newParams.set('course_type', selectedCourseType);
            }
            if (selectedStatus && selectedStatus !== 'Toggle Status') {
                newParams.set('status', selectedStatus);
            }

            debouncedUpdateFilter(newParams);
            return updatedValues;
        });
    };

    const handleInputChange = (key: FilterKey, value: string) => {
        updateSearchFilter(key, value);
    };

    const toggleExpand = (id: string) => {
        if (expandedOrderId === id) {
            setExpandedOrderId(null);
        } else {
            setExpandedOrderId(id);
        }
    };

    const exportOrders = () => {
        ordersService.exportOrdersToExcel(
            searchParams.get('page') || '1',
            searchParams.get('limit') || '20',
            searchParams.get('course_format') || '',
            searchParams.get('course') || '',
            searchParams.get('course_type') || '',
            searchParams.get('status') || '',
            searchParams.get('group') || '',
            searchParams.get('searchByName') || '',
            searchParams.get('searchBySurname') || '',
            searchParams.get('searchByEmail') || '',
            searchParams.get('searchByPhone') || '',
            searchParams.get('searchByAge') || '',
            searchParams.get('startDate') || '',
            searchParams.get('endDate') || '',
            searchParams.get('order') || '',
            searchParams.get('orderBy') || ''
        );
    };

    return (
        <div className={css.Orders}>
            <div className={css.filtersTop}>
                {filters.map(filter => (
                    <div key={filter.key} className={css[`filter${filter.key}`]}>
                        <input
                            type="text"
                            placeholder={`Search by ${filter.label}`}
                            value={localSearchValues[filter.key as FilterKey] || ''}
                            onChange={(e) => handleInputChange(filter.key as FilterKey, e.target.value)}
                        />
                    </div>))}
                <div className={css.excel}>
                    <button onClick={exportOrders}>EXCEL</button>
                </div>
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
                            <button onClick={() => updateFilter('status', 'InWork')}>In work</button>
                            <button onClick={() => updateFilter('status', 'New')}>New</button>
                            <button onClick={() => updateFilter('status', 'Aggre')}>Aggre</button>
                            <button onClick={() => updateFilter('status', 'Disaggre')}>Disaggre</button>
                            <button onClick={() => updateFilter('status', 'Dubbing')}>Dubbing</button>
                            <button onClick={() => updateFilter('status', '')}>Clear Status</button>
                        </div>)}
                </div>
                <div className={css.filters12}>
                    <button onClick={() => toggleDropdown('group')}>{selectedGroups || 'Toggle Groups'}</button>
                    {dropdownState.group && (
                        <div className={css.dropdownContent}>
                            {groups.map((group: IGroup) => (
                                <button key={group.name} onClick={() => updateFilter('group', group.name)}>
                                    {group.name}
                                </button>
                            ))}
                            <button onClick={() => updateFilter('group', '')}>Clear Groups</button>
                        </div>
                    )}
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
            <div className={css.zxc}>{orders.map((order, index) => (
                <Order
                    key={order._id}
                    order={order}
                    expandedOrderId={expandedOrderId}
                    toggleExpand={toggleExpand}
                    index={index}
                />
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

export {Orders};
