import React, { useEffect, useState, ReactNode } from 'react';
import { Form, Button, Table, Typography, Popconfirm, Select, Pagination } from 'antd';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { GetDatabase } from '../../../services/BasicAPI';
import { Item, ShowColumns, EditableCell } from "../../../InterFace/ISubjectGrades";

const App: React.FC = () => {
    const accessToken = localStorage.getItem("access_tokenStudent");
    const [form] = Form.useForm();
    const [Pageschange, setPageschange] = useState(1);
    const [Size, setSize] = useState(3);
    const [countSubjectGrades, setcountSubjectGrades] = useState(0);
    const [editingid, setEditingid] = useState('');
    const [dataSubjectGrades, setDataSubjectGrades] = useState<Item[]>([]);
    const [dataUpdate, setdataUpdate] = React.useState({ Item: {} as Item })
    useEffect(() => {
        const fetchData = async () => {
            const dataFromApi = await GetDatabase(`SubjectGrades/GetSubjectGradesStudentSubject`, accessToken ? accessToken : "Null");
            if (typeof dataFromApi === 'undefined') {
                console.log('studentList is of type void');
            } else {
                const SubjectGradesData = dataFromApi.data.map((SubjectGrades: any, index: number) => ({
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
            editable: false,
        },
        {
            title: 'Hệ số 2',
            dataIndex: 'gpaRank2',
            width: '8%',
            editable: false,
        },
        {
            title: 'Hệ số 3',
            dataIndex: 'gpaRank3',
            width: '8%',
            editable: false,
        },
        {
            title: 'Thi',
            dataIndex: 'gpaRank4',
            width: '8%',
            editable: false,
        },
        {
            title: 'Tên môn',
            dataIndex: 'subjectName',
            width: '8%',
            editable: false,
        },
        {
            title: 'Qua môn',
            dataIndex: 'passSubject',
            width: '8%',
            editable: false,
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
            <Link to="/Management/SubjectGradesAdd">
                <Button type="primary" style={{ width: "120px", marginBottom: "20px" }}>Add SubjectGrades</Button>
            </Link>
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