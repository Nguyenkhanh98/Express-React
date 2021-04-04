import React, { Component, useEffect, useMemo, useState } from 'react';
import API from '../helpers/api';
import config from '../config';
import { Pie, Bar } from 'react-chartjs-2';
import Ibox from '../theme/ibox';

const Dashboard = () => {
    const [listClass, setListClass] = useState([]);
    const [listSubject, setListSubject] = useState([]);
    const [totalStudentOfClasses, setTotalStudentOfClasses] = useState([]);
    const [listTotalMarkOfSubjects, setListTotalMarkOfSubjects] = useState([]);

    const getListStudentOfClass = async () => {
        try {
            const listTotalStudentOfClasses = await Promise.all(listClass.map(async (eachClass) => {
                const response = await API({
                    url: `${config.CLASS_ENDPOINT}/${eachClass.id}/students`,
                    method: 'GET',
                });
                const { count } = response.data.data;
                return {
                    classId: eachClass.id,
                    totalStudent: count
                }
            }))
            setTotalStudentOfClasses(listTotalStudentOfClasses);
        } catch (error) {
            console.log(error);
        }

    }

    const getListTotalMarkOfSubjects = async () => {
        const listMarkArrange = [
            { min: 0, max: 5, isMaxEqual: false }
            , { min: 5, max: 7, isMaxEqual: false }
            , { min: 7, max: 9, isMaxEqual: false }, { min: 9 }]
        try {
            const listTotalMarkOfSubjects = await Promise.all(listSubject.map(async (eachSubject) => {
                const listTotalMarkBySubject = await Promise.all(listMarkArrange.map(async (eachMarkArrange) => {
                    const response = await API({
                        url: `${config.SUBJECT_ENDPOINT}/${eachSubject.id}/marks`,
                        method: 'GET',
                        params: eachMarkArrange
                    });

                    const { data } = response.data;
                    return {
                        ...data,
                        markArrange: eachMarkArrange,
                    }
                }));

                return {
                    subjectId: eachSubject.id,
                    totalMark: listTotalMarkBySubject
                }

            }));
            setListTotalMarkOfSubjects(listTotalMarkOfSubjects);
        } catch (error) {
            console.log(error);
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

            setListSubject(subjects);
        } catch (error) {
            console.error(
                'Cannot load subject, something went wrong',
            );
        }
    }

    const getListClass = async () => {
        try {
            const classes = await API({
                url: `${config.CLASS_ENDPOINT}`,
                method: 'GET',
                params: { limit: 30 }
            });
            setListClass(classes.data.data.classes);
        } catch (error) {

        }
    }

    useEffect(() => {
        getListClass();
        getListSubject();
    }, []);

    useEffect(() => {
        getListStudentOfClass();
    }, [listClass]);

    useEffect(() => {
        getListTotalMarkOfSubjects();
    }, [listSubject])

    const renderChart = useMemo(() => {
        const state = (data) => {
            const arrayLabel = ['[0-5)', '[5-7)', '[7-9)', '[9-10]'];
            let arrayLabelEdit = [];
            let arrayData = [];
            data.forEach((element, index) => {
                arrayData.push(element.total);
                arrayLabelEdit.push(`${arrayLabel[index]} - ${Math.round(element.total / element.allMarks * 100)}%`);
            });
            return {
                labels: [...arrayLabelEdit],
                datasets: [
                    {
                        backgroundColor: [
                            '#B21F00',
                            '#C9DE00',
                            '#2FDE00',
                            '#00A6B4',
                            '#6800B4'
                        ],
                        hoverBackgroundColor: [
                            '#501800',
                            '#4B5000',
                            '#175000',
                            '#003350',
                            '#35014F'
                        ],
                        data: [...arrayData]
                    }
                ]
            }
        }
        return listTotalMarkOfSubjects.map(eachTotalMarkOfSubjects => {
            const subject = listSubject.find(sj => sj.id === eachTotalMarkOfSubjects.subjectId)
            return <>
                <div className="col-md-4">
                    <Ibox title={subject.name} subTitle={`Thống kê điểm môn ${subject.name}`}>

                        {<Pie data={state(eachTotalMarkOfSubjects.totalMark)} options={{
                            legend: {
                                display: true,
                                position: 'right'
                            }
                        }}>
                        </Pie>}

                    </Ibox>
                </div>

            </>
        })
    }, [listTotalMarkOfSubjects]);


    const dataBarChart = useMemo(() => {
        const backgroundColor = []
        const floor = Math.floor;
        const random = Math.random;
        const maxRandom = 255;
        const borderColor = [];
        const listTotalStudents = [];
        let classLabel;
        console.log(totalStudentOfClasses);
        if (totalStudentOfClasses.length > 0 && listClass.length > 0) {

            classLabel = listClass.map((eachClass, index) => {
                const randomColor = `${floor(random() * maxRandom)},${floor(random() * maxRandom)},${floor(random() * maxRandom)}`;

                backgroundColor.push(`rgba(${randomColor},0.2)`);
                borderColor.push(`rgb(${randomColor})`);
                listTotalStudents.push(totalStudentOfClasses[index].totalStudent);
                return eachClass.name;
            });

        }
        const data = {
            labels: classLabel,
            datasets: [{
                data: listTotalStudents,
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                borderWidth: 1,

            }]

        }
        return data;
    }, [listClass, totalStudentOfClasses]);

    console.log(dataBarChart);
    return (
        <>
            <div className="row">
                <div className="col-md-12">
                    <div className="text-center m-t-lg">
                        <h1> Statistics</h1>
                        <small>
                            Statistics of student and mark's average
                        </small>
                    </div>
                </div>
            </div>
            <div className="form-group row" >

                <div className="col-md-12">
                    <div className="text-center m-t-lg">
                        <h3> Number of students by class </h3>
                    </div>
                    <Bar
                        data={dataBarChart}
                        width={100}
                        height={30}
                        options={{
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        stepSize: 1,
                                        min: 17
                                    }
                                }]

                            }, legend: null
                        }}
                    />
                </div>
            </div>

            <div className="form-group row" >

                <div className="col-md-12">
                    <div className="text-center m-t-lg">
                        <h3>Statistics of student by mark average</h3>
                    </div>
                </div>

                {renderChart}
            </div>
        </>

    );
};

export default Dashboard;
