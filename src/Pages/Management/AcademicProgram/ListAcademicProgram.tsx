import React, { useEffect, useState, ReactNode } from 'react';
import { Form, Button, Input, InputNumber, Popconfirm, Table, Typography } from 'antd';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import axios from 'axios';
interface Item {
    academicProgramId: string,
    academicProgramName: string
    academicProgramTimeEnd: string,
    facultyName: string,
    subjectName: string,
    semesterName: string
}
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'number' | 'text';
    record: Item;
    index: number;
    children: React.ReactNode;
}
interface ShowColumns {
    title: string;
    dataIndex: string;
    width: string;
    fixed: string;
    render?: RenderFunction | RenderWithCellFunction;
}

type RenderFunction = (value: any, record: Item, index: number) => ReactNode;
type RenderWithCellFunction = (value: any, record: Item, index: number) => ReactNode;

const EditableCell: React.FC<EditableCellProps> = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
}) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[
                        {
                            required: true,
                            message: `Please Input ${title}!`,
                        },
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};
const App: React.FC = ({ history }: any) => {
    const [form] = Form.useForm();
    const [editingid, setEditingid] = useState('');
    const [dataAcademicProgram, setdataAcademicProgram] = useState<Item[]>([]);
    const [dataUpdate, setdataUpdate] = React.useState({ Item: {} as Item })
    const [data, setData] = useState<any>(null);
    useEffect(() => {
        const accessToken = localStorage.getItem("access_tokenAdmin");
        console.log(accessToken);
        const fetchData = async () => {
            try {
                const response = await axios.get("https://localhost:7232/api/AcademicPrograms/GetListAcademicProgram?pages=1&size=1",
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    });
                console.log(response.data);
                const AcademicProgramsData = response.data.map((AcademicProgram: any, index: number) => ({
                    academicProgramId: AcademicProgram.academicProgramId,
                    academicProgramName: AcademicProgram.academicProgramName,
                    academicProgramTimeEnd: AcademicProgram.academicProgramTimeEnd,
                    facultyName: AcademicProgram.facultyName,
                    subjectName: AcademicProgram.subjectName,
                    semesterName: AcademicProgram.semesterName,
                }));
                setdataAcademicProgram(AcademicProgramsData);
                console.log('Fetch data successful');
            } catch (error) {
                console.error(error);

            }
        };
        fetchData();
    }, [dataUpdate]);
    const handleDataChange = (newData: Item) => {
        setdataUpdate(prevData => ({
            ...prevData,
            Item: newData
        }));
    };
    const DeleteID = (record: Partial<Item> & { AcademicProgramsId: string }) => {
        axios
            .delete(
                "https://localhost:7232/api/AcademicPrograms/" + record.AcademicProgramsId
            )
            .then((response) => {
                alert("Đã xóa môn học này -" + record.AcademicProgramsId);
                const newDataStudent = dataAcademicProgram.filter(item => item.academicProgramId !== record.AcademicProgramsId);
                setdataAcademicProgram(newDataStudent);
            })
            .catch((err) => console.log(err));
    };

    const isEditing = (record: Item) => record.academicProgramId === editingid;

    const edit = (record: Partial<Item>) => {
        form.setFieldsValue({ AcademicProgramName: '', AcademicProgramCredit: 0, AcademicProgramMandatory: 'hiban', ...record });
        // setEditingid(record.academicProgramId);
    };
    // const DetailCLass = (record: Partial<Item> & { AcademicProgramsId: string }) => {

    //     axios.get('https://localhost:7232/api/Teachers/ListStudentLearn?IdClass=' + record.AcademicProgramsId)
    //         .then((response) => {
    //             // Lấy dữ liệu từ phản hồi
    //             const responseData = response.data;
    //             setData(responseData);
    //             console.log(responseData);
    //             // Chuyển hướng đến một thành phần khác và truyền dữ liệu
    //             history.push('./ListStudentClassLean', { data: responseData });
    //         })
    //         .catch((error) => {
    //             console.error('Lỗi khi gọi API:', error);
    //         });
    // };
    const cancel = () => {
        setEditingid('');
    };

    const save = async (id: string) => {
        try {
            const row = (await form.validateFields());
            row.AcademicProgramId = id;
            console.log(row.AcademicProgramMandatory);
            let result = (row.AcademicProgramMandatory === "true" ? true : false);
            row.AcademicProgramMandatory = result;
            const newData = [...dataAcademicProgram];
            const index = newData.findIndex((item) => id === item.academicProgramId);
            // id 
            if (index > -1) {
                newData.splice(index, 1, row);
                setdataAcademicProgram(newData);
                setEditingid('');
                axios
                    .put(
                        "https://localhost:7232/api/AcademicPrograms/" +
                        id,
                        newData[index]
                    )
                    .then((response) => console.log(response))
                    .catch((err) => console.log(err));
            } else {
                newData.push(row);
                setdataAcademicProgram(newData);
                setEditingid('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const columns = [
        {
            title: 'Name AcademicProgram',
            dataIndex: 'academicProgramName',
            width: '20%',
            editable: true,
        },
        {
            title: 'Time End Academic Program',
            dataIndex: 'academicProgramTimeEnd',
            width: '20%',
            editable: true,
        },
        {
            title: 'Semester',
            dataIndex: 'semesterName',
            width: '20%',
            editable: true,
        },
        {
            title: 'Faculty',
            dataIndex: 'facultyName',
            width: '20%',
            editable: true,
        },
        {
            title: 'subject',
            dataIndex: 'subjectName',
            width: '20%',
            editable: true,
        },
        {
            title: 'operation',
            dataIndex: 'operation',
            width: '15%',
            render: (_: any, record: Item) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link onClick={() => save(record.academicProgramId)} style={{ marginRight: 8 }}>
                            Save
                        </Typography.Link>
                        <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                            <a>Cancel</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <>
                        <Typography.Link disabled={editingid !== ''} style={{ marginLeft: "20px" }} onClick={() => edit(record)}>
                            Edit
                        </Typography.Link>
                        {/* <Typography.Link disabled={editingid !== ''} style={{ marginLeft: "20px" }} onClick={() => DeleteID(record)}>
                            Delete
                        </Typography.Link> */}
                    </>
                );
            },
        },
    ];

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: Item) => ({
                record,
                inputType: col.dataIndex === 'id' ? 'AcademicProgramName' : 'AcademicProgramMandatory',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    return (
        <>
            <Link to="/Management/AddAcademicProgram">
                <Button type="primary" style={{ width: "120px", marginBottom: "20px" }}>Add Academic</Button>
            </Link>
            <Form form={form} component={false}>
                <Table
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                    bordered
                    dataSource={dataAcademicProgram}
                    columns={mergedColumns}

                    rowClassName="editable-row"
                    pagination={{
                        onChange: cancel,
                    }}
                />
            </Form>
        </>
    );
};

export default App;