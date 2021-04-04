import React, { useState, useEffect } from 'react';
import { toastr } from 'react-redux-toastr';
import { Link } from 'react-router-dom';

import Search from '../theme/search';
import GeneralTable from '../theme/generalTable';
import Pagination from '../theme/pagination';
import DeleteModel from '../theme/deleteModel';
import BreadCrumb from '../theme/breadcrum';
import sortSC from '../helpers/sortListObject';
import IBox from '../theme/ibox';
import DropDown from '../theme/dropdown';
import API from '../helpers/api';
import { UserService } from '../services';
import config from '../config';

const limit = 10;
let offset = 0;

const initDeletedModelState = { isShow: false, service: config.USER_ENDPOINT, id: '' };

const convertData = (data) =>
    data.map((currentValue) => {
        const id = currentValue.id;
        const avatar = <img src={config.BASE_URL + currentValue.avatar} width="50" />;

        return {
            userId: id,
            cmnd: currentValue.cmnd,
            name: currentValue.firstName + currentValue.middleName + ' ' + currentValue.lastName,
            dateOfBirdth: currentValue.dateOfBirdth,
            class: currentValue.class.name,
            sex: currentValue.sex,
            phone: currentValue.phone,
            address: currentValue.address,
            avatar,
            action: [['edit', 'delete'], currentValue.userName],
        };
    });

const User = (props) => {
    const { path } = props.match;

    const [deletedModel, setDeletedModel] = useState(initDeletedModelState);

    const [totalUsers, setTotalUsers] = useState(0);

    const [listUsers, setListUsers] = useState({
        data: [],
        status: '',
        search: '',
    });

    const [listClass, setListClass] = useState({
        name: 'listClass',
        search: '',
        data: [],
        value: 0,
        isActive: false,
    });

    const [listGrade, setListGrade] = useState({
        name: 'listGrade',
        search: '',
        data: [],
        value: 0,
    });

    const [search, setSearch] = useState('');

    const [currentPage, setCurrentPage] = useState(1);

    const { isShow, service, id } = deletedModel;

    const getListUser = async () => {
        offset = currentPage === 1 ? 0 : (currentPage - 1) * limit;
        const grade = listGrade.value > 0 ? listGrade.value : null;
        const classId = listClass.value > 0 ? listClass.value : null;

        try {
            const data = await UserService.getListUser({
                offset,
                limit,
                name: search || '',
                grade,
                class: classId
            });
            const { count, users } = data.data.data;

            const newListUsers = convertData(users);
            setTotalUsers(count);
            setListUsers({ ...listUsers, data: newListUsers });
        } catch (error) {
            toastr.error(
                'something went wrong when get users',
            );
        }
    };

    const getListClass = async () => {
        const grade = listGrade.value > 0 ? listGrade.value : null;
        try {
            const data = await API({
                url: config.CLASS_ENDPOINT,
                method: 'get',
                params: { offset: 0, limit: 20, name: search || '', grade }
            });
            const { classes } = data.data.data;
            const formatClass = classes.map(currentClass => {
                return {
                    value: currentClass.id,
                    label: currentClass.name
                }
            });

            setListClass({ ...listClass, data: formatClass });
        } catch (error) {
            toastr.error(
                'something went wrong when get classes',
            );
        }
    }

    const getListGrade = async () => {
        try {
            const data = await API({
                url: config.GRADE_ENDPOINT,
                offset: 0,
                limit: 20,
                name: search || '',
            });
            const { grades } = data.data.data;
            const formatGrades = grades.map(currentGrade => {
                return {
                    value: currentGrade.id,
                    label: currentGrade.level
                }
            });

            setListGrade({ ...listGrade, data: formatGrades });
        } catch (error) {
            console.log(error);
            toastr.error(
                'something went wrong when get grades',
            );
        }
    }

    const onClickAction = (data) => {
        const { type } = data;
        if (type === 'delete') {
            setDeletedModel({ ...deletedModel, id: data.id, isShow: true });
        }
    };

    const onCloseDeletedModel = (data) => {
        setDeletedModel({ ...deletedModel, isShow: false });
        if (data.isDeleted) {
            getListUser();
        }
    };

    const onPaginationChange = (data) => {
        const newPage = data.currentPage;
        setCurrentPage(newPage);
    };

    const onSearchChange = (value) => {
        setCurrentPage(1);
        setSearch(value);
    };

    const onGradeSelected = (e) => {
        if (e.value === 0) {
            setListClass({ ...listClass, isActive: false, value: 0 });
        } else {
            setListClass({ ...listClass, isActive: true, value: 0 });

        }
        setListGrade({ ...listGrade, value: e.value });
    };

    const onClassSelected = (e) => {
        setListClass({ ...listClass, value: e.value });
    };

    useEffect(() => {
        getListUser();
    }, [
        currentPage,
        search,
        listGrade.value,
        listClass.value
    ]);

    useEffect(() => {
        getListClass();
    }, [listGrade.value]);

    useEffect(() => {

        getListGrade();
    }, []);

    const labels = [
        'ID',
        'CMND',
        'Name',
        'Date of birdth',
        'Class',
        'Sex',
        'Phone number',
        'Address',
        'Avatar'
    ];

    const breadCrumbData = [{ label: 'Users' }];

    let classes = [{ label: 'All class', value: 0 }];
    if (listClass.data.length > 0) {
        classes = [...classes, ...listClass.data];
    }

    const listClassDropdown = (
        <DropDown
            data={classes}
            value={classes.filter((x) => x.value === listClass.value)}
            onSelected={onClassSelected}
            active={listClass.isActive}
            className="validate-error"
        />
    );

    let grades = [{ label: 'All grades', value: 0 }];
    if (listGrade.data.length > 0) {
        grades = [...grades, ...listGrade.data];
    }

    let listGradeDropdown = (
        <DropDown data={grades}
            value={grades.filter((x) => x.value === listGrade.value)}
            onSelected={onGradeSelected}
            className="validate-error" />
    );


    return (
        <>
            <BreadCrumb title={'Users'} items={breadCrumbData} />
            <IBox title={'User'} subTitle={'All users'}>
                <div className="row">
                    <div className="col-sm-3 m-b-xs">
                        <Search onChange={onSearchChange} className="col-sm-12" placeholder="Search by name" />
                    </div>

                    <div className="col-sm-2 m-b-xs">

                        <div className="form-group row">
                            <div className="col-sm-12">{listGradeDropdown}</div>
                        </div>
                    </div>

                    <div className="col-sm-2 m-b-xs">

                        <div className="form-group row">
                            <div className="col-sm-12">{listClassDropdown}</div>
                        </div>
                    </div>


                    <div className="col-sm-2 m-b-xs align-self-end">

                        <div className="form-group row">
                            <div className="col-sm-12 ">Total: {totalUsers} students</div>
                        </div>
                    </div>

                    <div className="col-sm-3 m-b-xs text-right">
                        <Link className="btn btn-primary" to="/users/account">
                            <i className="fa fa-plus"></i>
                            Create user
                        </Link>
                    </div>

                </div>
                <GeneralTable
                    header={labels}
                    data={listUsers.data}
                    onClickAction={onClickAction}
                    service={path}
                    labelSort={0}
                // directionDesc
                />
                <Pagination
                    total={totalUsers}
                    currentPage={currentPage}
                    onClick={onPaginationChange}
                    allowItemsPerPage={[20, 40, 60]}
                />
                <DeleteModel
                    show={isShow}
                    service={service}
                    id={parseInt(id)}
                    onClose={onCloseDeletedModel}
                />
            </IBox>
        </>
    );
};

export default User;
