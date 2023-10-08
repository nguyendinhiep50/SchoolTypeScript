
import React, { Component, ChangeEvent, useState } from 'react';
import * as XLSX from 'xlsx'; // Use * as XLSX to import all named exports
import { Space, Table, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import Item from 'antd/es/list/Item';
import { } from '../../../services/BasicAPI'
import axios from "axios";
import { BrowserRouter as Link, useHistory } from 'react-router-dom';
import dayjs from 'dayjs';

interface Item {
    studentNameLogin: "",
    studentPhoneNumber: "",
    studentName: "",
    studentEmail: "",
    studentBirthDate: "",
    facultyId: "",
}


const App: React.FC = () => {
    const [dataStudent, setDataStudent] = useState<Item[]>([]);
    const history = useHistory();
    const [DataPost, setDataPost] = useState({
        studentName: "",
        studentEmail: "",
        studentNameLogin: "",
        studentPhoneNumber: "",
        studentBirthDate: "",
        facultyId: "",
    });
    const columns = [
        {
            title: 'Tên học sinh',
            dataIndex: 'studentName',
        },
        {
            title: 'Email học sinh',
            dataIndex: 'studentEmail',
        },
        {
            title: 'Tên Login',
            dataIndex: 'studentNameLogin',
        },
        {
            title: 'Phone Number',
            dataIndex: 'studentPhoneNumber',
        },
        {
            title: 'Ngày sinh',
            dataIndex: 'studentBirthDate',
        },
        {
            title: 'khoa',
            dataIndex: 'facultyId',
        },

        {
            title: 'operation',
            dataIndex: 'operation',
            render: (_: any, record: Item) => {
            },
        },
    ];
    const mergedColumns = columns.map((col) => {
        if (typeof col.render === "function") {
            return {
                ...col,
                onCell: (record: Item) => ({
                    record,
                    inputType: col.dataIndex === 'id' ? 'facultyName' : '',
                    dataIndex: col.dataIndex,
                    title: col.title,
                }),
                render: (text: string, record: Item) => {
                    if (col.dataIndex === "operation") {
                        return (
                            <>
                                <Typography.Link onClick={() => AddStudent(record)}>
                                    Add
                                </Typography.Link>
                                <Typography.Link style={{ marginLeft: "20px" }} onClick={() => DeleteID(record)}>
                                    Delete
                                </Typography.Link>
                            </>
                        );
                    }
                },
            };
        }
        else {
            return col;
        }

    });
    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const data = e.target?.result as ArrayBuffer;
                const workbook = XLSX.read(data, { type: 'binary' });
                const sheetName = workbook.SheetNames[0]; // Assuming you want the first sheet
                const sheet = workbook.Sheets[sheetName];
                const excelData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

                const ListData = [];
                // Bắt đầu từ index 1 để bỏ qua hàng tiêu đề
                for (let i = 1; i < excelData.length; i++) {
                    const rowData = excelData[i] as any;
                    if (rowData.length > 0) {
                        const dataObject: any = {};
                        console.log(rowData[0]);
                        dataObject.studentNameLogin = rowData[2];
                        dataObject.studentPhoneNumber = rowData[3] + "1";
                        dataObject.studentName = rowData[0]; // Assuming columnNames is an array of column indices
                        dataObject.studentEmail = rowData[1];

                        var excelDate = rowData[4];
                        const dateObject = new Date((excelDate - 1) * 24 * 60 * 60 * 1000 + new Date(1900, 0, 1).getTime());
                        dataObject.studentBirthDate = dateObject.toISOString();
                        dataObject.facultyId = rowData[5]; // Replace 'anotherProperty' with the actual property name

                        ListData.push(dataObject);
                    }
                }
                setDataStudent(ListData);
            };
            reader.readAsBinaryString(file);
        }
    };
    const AddStudent = async (Student: Item) => {
        const accessToken = localStorage.getItem("access_tokenAdmin");
        axios
            .post("https://localhost:7232/api/Students", Student
                , {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                })
            .then((response) => {
                alert("Thêm thành công")
                history.push("/Management/StudentList");
            })
            .catch((err) => console.log(err));
    };
    const AddManyStudent = async () => {
        console.log(dataStudent);
        const accessToken = localStorage.getItem("access_tokenAdmin");
        axios
            .post("https://localhost:7232/api/Students/PostManyStudent", dataStudent
                , {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                })
            .then((response) => {
                alert("Thêm thành công")
                history.push("/Management/StudentList");
            })
            .catch((err) => console.log(err));
    };
    const handleDataChange = (newData: any) => {
        setDataStudent(newData);
    };
    const DeleteID = (record: Partial<Item>) => {
        const newDataStudentDelete = dataStudent.filter(x => x.studentName !== record.studentName && x.studentEmail !== record.studentEmail);
        handleDataChange(newDataStudentDelete);
    };
    return <>
        <div>
            <input type="file" onChange={handleFileUpload} />
        </div>
        <Table columns={mergedColumns} dataSource={dataStudent} />
        <div className='btn-btn-primary'>
            <button onClick={AddManyStudent}>Add hết</button>
        </div>
    </>

}
export default App;
