import React, { useState, useEffect, useMemo } from 'react';
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
import DataGrid, { TextEditor, Column } from 'react-data-grid';
import config from '../config';

const limit = 20;
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

const Transcript = (props) => {
    const { path } = props.match;

    const [deletedModel, setDeletedModel] = useState(initDeletedModelState);

    const [totalUsers, setTotalUsers] = useState(0);

    const [listUsers, setListUsers] = useState({
        data: [],
        status: '',
        search: '',
    });

    const [transcripts, setTranscripts] = useState([]);

    const [rows, setRows] = useState([])

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

    const [listSubject, setListSubject] = useState({
        name: 'listSubject',
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
            const newListUsers = users.map(eachUser => {
                const { lastName, firstName, middleName, id } = eachUser;
                const classData = eachUser.class;
                return {
                    fullName: firstName + middleName + ' ' + lastName,
                    id,
                    className: classData.name
                }
            });
            setTotalUsers(count);
            setListUsers({ ...listUsers, data: newListUsers });
        } catch (error) {
            console.log(error);
            toastr.error(
                'something went wrong',
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
                'something went wrong',
            );
        }
    }

    const getListGrade = async () => {
        try {
            const data = await API({
                url: config.GRADE_ENDPOINT,
                params: {
                    offset: 0,
                    limit: 20,
                    name: search || '',
                }

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
            toastr.error(
                'something went wrong',
            );
        }
    }

    const getListSubject = async () => {
        try {
            const data = await API({
                url: config.SUBJECT_ENDPOINT,
                params: { offset: 0, limit: 20, },
                method: 'GET'
            });

            const { subjects } = data.data.data;
            const formatsubjects = subjects.map(eachSubjects => {
                return {
                    value: eachSubjects.id,
                    label: eachSubjects.name,
                    alias: eachSubjects.alias
                }
            });

            setListSubject({ ...listSubject, data: formatsubjects });
        } catch (error) {
            toastr.error(
                'Cannot load subject, something went wrong',
            );
        }
    }

    const getListTranscript = async () => {
        try {
            const { value } = listSubject;
            let transcriptsRequest;
            if (value === 0) {
                transcriptsRequest = await Promise.all(listUsers.data.map(async (eachUser) => {
                    return await API({
                        url: `${config.USER_ENDPOINT}/${eachUser.id}/marks`,
                        params: { offset: 0, limit: 20, },
                        method: 'GET'
                    });
                }));
            } else {
                transcriptsRequest = await Promise.all(listUsers.data.map(async (eachUser) => {
                    return await API({
                        url: `${config.USER_ENDPOINT}/${eachUser.id}/marks/${value}`,
                        params: { offset: 0, limit: 20, },
                        method: 'GET'
                    });
                }));
            }
            let transcripts = [];
            if (value === 0) {
                transcripts = transcriptsRequest.map(eachTranscriptResponse => {
                    return eachTranscriptResponse.data.marks.marks;
                });
            } else {
                transcripts = transcriptsRequest.map(eachTranscriptResponse => {
                    return eachTranscriptResponse.data.marks;
                });
            }

            setTranscripts(transcripts);
        } catch (error) {
            console.log(error);
        }
    }


    const updateMark = async (userId, subjectId, score) => {
        try {
            const response = await API({
                url: `${config.USER_ENDPOINT}/${userId}/marks/${subjectId}`,
                data: { score },
                method: 'PUT'
            });
        } catch (error) {
            console.log(error);
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
        console.log(newPage);
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

    const onSubjectSelected = (e) => {
        setListSubject({ ...listSubject, value: e.value });
    }

    const onRowsChange = (rows, data) => {

        const { indexes, column } = data;
        const rowIndex = indexes[0];
        const rowChange = rows[rowIndex];
        const { key } = column;
        let newScore = parseInt(rowChange[key]);

        if (isNaN(newScore) || newScore < 0 || newScore > 10) {
            newScore = '';
        }
        const { id } = rowChange;
        updateMark(id, key, newScore);
        setRows(rows);
    }

    useEffect(() => {
        getListTranscript();
    }, [
        listUsers.data, listSubject.value
    ]);
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
        getListSubject();
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

    let subjects = [{ label: 'All Subjects', value: 0 }];
    if (listSubject.data.length > 0) {
        subjects = [...subjects, ...listSubject.data];
    }

    let listSubjectDropDown = (
        <DropDown data={subjects}
            value={subjects.filter((x) => x.value === listSubject.value)}
            onSelected={onSubjectSelected}
            className="validate-error" />
    );

    const allSubjectColumns = listSubject.data.length > 0 ? listSubject.data.map(eachSubject => {
        return {
            key: eachSubject.value,
            name: eachSubject.label,
            id: eachSubject.value,
            editor: TextEditor,
            resizable: true,

        }
    }) : [];

    const currentSubjectColumns = listSubject.value === 0 ? allSubjectColumns
        : allSubjectColumns.find(x => x.id === listSubject.value);



    const columns = [
        {
            key: 'id',
            name: 'Student ID',
            resizable: true,
            frozen: true,
        },
        {
            key: 'fullName',
            name: 'Full Name',
            resizable: true,
            width: 250,
            frozen: true,

        },
        {
            key: 'className',
            name: 'Class',
            resizable: true,
            frozen: true,
        }
    ];

    const allColums = listSubject.value > 0 ? [...columns, currentSubjectColumns] : [...columns, ...currentSubjectColumns];

    useEffect(() => {
        if (listUsers.data.length > 0 && transcripts.length > 0) {
            const mergeData = listUsers.data.map((eachUser, index) => {
                let userTranscript = transcripts[index];
                if (!userTranscript.length)
                    userTranscript = [userTranscript];

                const mergeMarkAndUser = {};

                userTranscript.forEach(eachUserMark => {
                    mergeMarkAndUser[eachUserMark.subjectId] = eachUserMark.score;
                });

                if (listSubject.value > 0) {
                    mergeMarkAndUser[listSubject.value] = mergeMarkAndUser[listSubject.value] || '';
                }
                else {
                    listSubject.data.forEach(eachSubject => {
                        mergeMarkAndUser[eachSubject.id] = mergeMarkAndUser[eachSubject.id] || '';
                    });
                }

                return {
                    ...eachUser,
                    ...mergeMarkAndUser
                }
            })
            setRows(mergeData);
        }

    }, [transcripts]);

    return (
        <>
            <BreadCrumb title={'Transcripts'} items={breadCrumbData} />
            <IBox title={'Transcripts'} subTitle={'All Transcripts'}>
                <div className="row">
                    <div className="col-sm-3 m-b-xs">
                        <Search onChange={onSearchChange} className="col-sm-12" placeholder="Search by student name" />
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

                    <div className="col-sm-2 m-b-xs">

                        <div className="form-group row">
                            <div className="col-sm-12">{listSubjectDropDown}</div>
                        </div>
                    </div>
                    <div className="col-sm-3 m-b-xs align-self-end">

                        <div className="form-group row">
                            <div className="col-sm-12 ">Total: {totalUsers} students</div>
                        </div>
                    </div>


                </div>
                <DataGrid
                    columns={allColums}
                    onRowsChange={onRowsChange}
                    rows={rows}
                    style={{ minHeight: '90vh' }}
                />
                <Pagination
                    total={totalUsers}
                    currentPage={currentPage}
                    onClick={onPaginationChange}
                    allowItemsPerPage={[20, 40, 60]}
                    itemPerPage={20}

                />
            </IBox>
        </>
    );
};

export default Transcript;
