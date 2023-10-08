import React, { useEffect, useState, ReactNode } from 'react';
import { Form, Button, Table, Typography, Popconfirm, Select, Pagination } from 'antd';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { GetDatabase, DeleteDatabase, UpDataDatabase } from '../../../services/BasicAPI';
import { Item, ChildProps, ShowColumns, EditableCell } from "../../../InterFace/ISubjectGrades";

import { PagesAndSize } from '../../../services/types';

const App: React.FC<ChildProps> = (props: any) => {
    const SubjectGradesAddDto = {
        subjectGradesId: "",
        gpaRank1: 0,
        gpaRank2: 0,
        gpaRank3: 0,
        gpaRank4: 0
    };
    const [form] = Form.useForm();
    const [Pageschange, setPageschange] = useState(1);
    const [Size, setSize] = useState(3);
    const [countSubjectGrades, setcountSubjectGrades] = useState(0);
    const [editingid, setEditingid] = useState('');
    const [dataSubjectGrades, setDataSubjectGrades] = useState<Item[]>([]);
    const [dataUpdate, setdataUpdate] = React.useState({ Item: {} as Item })
    const { location } = props;
    const dataFromApi = location.state?.data;
    const [IdClassLearn, setIdClassLearn] = useState(dataFromApi);
    useEffect(() => {
        const fetchData = async () => {
            console.log(dataFromApi);
            const SubjectGradesData = dataFromApi?.map((SubjectGrades: any, index: number) => ({
                subjectGradesId: SubjectGrades.subjectGradesId,
                studentName: SubjectGrades.studentName,
                subjectName: SubjectGrades.subjectName,
                gpaRank1: SubjectGrades.gpaRank1,
                gpaRank2: SubjectGrades.gpaRank2,
                gpaRank3: SubjectGrades.gpaRank3,
                gpaRank4: SubjectGrades.gpaRank4,
                passSubject: SubjectGrades.passSubject,
            }));
            setDataSubjectGrades(SubjectGradesData);
        }
        fetchData();
        console.log("render lại nè");
    }, [dataUpdate, Pageschange]);
    const isEditing = (record: Item) => record.subjectGradesId === editingid;

    const edit = (record: Partial<Item> & { subjectGradesId: string }) => {
        console.log(record.subjectGradesId);
        form.setFieldsValue({ studentName: '', subjectName: '', gpaRank1: '', gpaRank2: '', gpaRank3: '', gpaRank4: '', ...record });
        setEditingid(record.subjectGradesId);
    };
    const handleDataChange = (newData: any) => {
        setdataUpdate(prevData => ({
            ...prevData,
            Item: newData
        }));
    };

    const save = async (id: string) => {
        const accessToken = localStorage.getItem("access_tokenTeacher");

        try {
            const row = (await form.validateFields()) as Item;
            SubjectGradesAddDto.subjectGradesId = id;
            SubjectGradesAddDto.gpaRank1 = typeof row?.gpaRank1 === 'string' ? parseFloat(row.gpaRank1) : row?.gpaRank1;
            SubjectGradesAddDto.gpaRank2 = typeof row?.gpaRank2 === 'string' ? parseFloat(row.gpaRank2) : row?.gpaRank2;
            SubjectGradesAddDto.gpaRank3 = typeof row?.gpaRank3 === 'string' ? parseFloat(row.gpaRank3) : row?.gpaRank3;
            SubjectGradesAddDto.gpaRank4 = typeof row?.gpaRank4 === 'string' ? parseFloat(row.gpaRank4) : row?.gpaRank4;


            const newData = [...dataSubjectGrades];
            const index = newData.findIndex((item) => id === item.subjectGradesId);
            row.studentName = dataSubjectGrades[index].studentName
            row.subjectName = dataSubjectGrades[index].subjectName
            // id
            if (index > -1) {
                newData.splice(index, 1, row);
                console.log(id);
                const update = await UpDataDatabase("SubjectGrades/UpdateSubjectGradesStudent", SubjectGradesAddDto, accessToken ? accessToken : "nulll");
                if (typeof update === 'undefined') {
                    setEditingid('');
                    return;
                }
                setDataSubjectGrades(newData);
                setEditingid('');

            } else {
                newData.push(row);
                setDataSubjectGrades(newData);
                setEditingid('');
            }
        } catch (errInfo) {
            setEditingid('');
            console.log('Validate Failed:', errInfo);
        }
    };

    // const DeleteID = (record: Partial<Item> & { studentId: string }) => {
    //     const bienxoa = DeleteSubjectGrades(record.studentId);
    //     if (typeof bienxoa === 'undefined') {
    //         console.log('studentList is of type void');
    //     } else {
    //         const newDataSubjectGrades = dataSubjectGrades.filter(item => item.studentId !== record.studentId);
    //         handleDataChange(newDataSubjectGrades);
    //     }
    // };
    const cancel = () => {
        setEditingid('');
    };

    const dataColumns: ShowColumns[] = [
        {
            title: 'Tên học sinh',
            dataIndex: 'studentName',
            width: '16%',
            editable: false,
        },
        {
            title: 'Hệ số 1',
            dataIndex: 'gpaRank1',
            width: '10%',
            editable: true,
        },
        {
            title: 'Hệ số 2',
            dataIndex: 'gpaRank2',
            width: '8%',
            editable: true,
        },
        {
            title: 'Hệ số 3',
            dataIndex: 'gpaRank3',
            width: '8%',
            editable: true,
        },
        {
            title: 'Thi',
            dataIndex: 'gpaRank4',
            width: '8%',
            editable: true,
        },
        {
            title: 'Tên môn',
            dataIndex: 'subjectName',
            width: '8%',
            editable: false,
        },
        {
            title: 'operation',
            dataIndex: 'operation',
            width: '8%',
            editable: false,
            render: (_: any, record: Item) => {
                const editableShow = isEditing(record);
                return editableShow ? (
                    <span>
                        <Typography.Link onClick={() => save(record.subjectGradesId)} style={{ marginRight: 8 }}>
                            Save
                        </Typography.Link>
                        <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                            <a>Cancel</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <>
                        <Typography.Link disabled={editingid !== ''} onClick={() => edit(record)}>
                            Edit
                        </Typography.Link>
                        {/* <Typography.Link disabled={editingid !== ''} style={{ marginLeft: '20px' }} onClick={() => DeleteID(record)}>
                            Delete
                        </Typography.Link> */}
                    </>
                );
            },
        },
    ];
    const mergedColumns = dataColumns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: Item) => ({
                record,
                inputType: col.dataIndex === 'id' ? 'studentName' : "null",
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });
    return (
        <>

            <Form form={form} component={false} style={{ width: "86%" }}>
                <Table<Item>
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    bordered
                    dataSource={dataSubjectGrades}
                    rowClassName="editable-row"
                    pagination={false}
                >
                    {mergedColumns.map((column: ShowColumns) => {
                        const { dataIndex, title, width, ...restColumnProps } = column;

                        // Adjust the render function to pass the count as the index parameter
                        const adjustedRender = column.render
                            ? (value: any, record: Item, index: number) =>
                                column.render!(value, record as Item, index)
                            : undefined;
                        return (
                            <Table.Column<Item>
                                key={dataIndex}
                                title={title}
                                dataIndex={dataIndex}
                                width={width}
                                render={adjustedRender}
                                {...restColumnProps}
                            />
                        );
                    })}
                </Table>
                <Pagination defaultCurrent={1} defaultPageSize={Size} total={countSubjectGrades.valueOf()} />
            </Form>
        </>
    );
};

export default App;