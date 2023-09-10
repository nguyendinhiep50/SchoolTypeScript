import React, { useEffect, useState } from 'react';
import { Form, Table, Typography, Pagination } from 'antd';
import { BrowserRouter as Router } from 'react-router-dom';
import { format } from 'date-fns';
// import Item from 'antd/es/list/Item';
import { DeleteStudent } from '../../../services/APIStudent';
import { Item, ChildProps, ShowColumns, EditableCell } from "../../../InterFace/IStudent";
const App: React.FC<ChildProps> = (props: any) => {
    const [form] = Form.useForm();
    const [Pageschange, setPageschange] = useState(1);
    const [Size, setSize] = useState(3);
    const [countStudent, setcountStudent] = useState(0);
    const [dataStudent, setDataStudent] = useState<Item[]>([]);
    const [dataUpdate, setdataUpdate] = React.useState({ Item: {} as Item })
    const { location } = props;
    const dataFromApi = location.state?.data;
    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log(dataFromApi);
                const studentsData = dataFromApi.map((student: any, index: number) => ({
                    studentId: student.studentId,
                    studentName: student.studentName,
                    studentImage: student.studentImage,
                    studentBirthDate: format(new Date(student.studentBirthDate), 'yyyy-MM-dd'),
                    facultyName: student.facultyName,
                }));
                setDataStudent(studentsData);
                console.log(dataStudent);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
        console.log("render lại nè");
    }, [dataUpdate, Pageschange]);

    const handleDataChange = (newData: any) => {
        setdataUpdate(prevData => ({
            ...prevData,
            Item: newData
        }));
    };
    const DeleteID = (record: Partial<Item> & { studentId: string }) => {
        const bienxoa = DeleteStudent(record.studentId);
        if (typeof bienxoa === 'undefined') {
            console.log('studentList is of type void');
        } else {
            const newDataStudent = dataStudent.filter(item => item.studentId !== record.studentId);
            handleDataChange(newDataStudent);
        }
    };
    const handleChanegPages = (newPages: number) => {
        console.log(newPages);
        setPageschange(newPages);
    };
    const dataColumns: ShowColumns[] = [
        {
            title: 'Tên học sinh',
            dataIndex: 'studentName',
            width: '16%',
            editable: true,
        },
        {
            title: 'Ảnh',
            dataIndex: 'studentImage',
            width: '10%',
            editable: true,

        },
        {
            title: 'Ngày sinh',
            dataIndex: 'studentBirthDate',
            width: '8%',
            editable: true,
        },

        {
            title: 'operation',
            dataIndex: 'operation',
            width: '8%',
            editable: false,
            render: (_: any, record: Item) => {
                return (
                    <>
                        <Typography.Link style={{ marginLeft: '20px' }} onClick={() => DeleteID(record)}>
                            Delete
                        </Typography.Link>
                    </>
                )
            },
        },
    ];

    return (
        <>
            <h1>List Student class { }</h1>
            <Form form={form} component={false} style={{ width: "86%" }}>
                <Table<Item>
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    bordered
                    dataSource={dataStudent}
                    rowClassName="editable-row"
                    pagination={false}
                >
                    {dataColumns.map((column: ShowColumns) => {
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
                <Pagination defaultCurrent={1} defaultPageSize={Size} onChange={handleChanegPages} total={countStudent.valueOf()} />
            </Form>
        </>
    );
};

export default App;
